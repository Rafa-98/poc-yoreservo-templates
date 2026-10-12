#!/usr/bin/env node
/**
 * YoReservo Backoffice prototypes — static checker.
 *
 * Usage (from anywhere):   node scripts/check-prototypes.js
 * Exit code: 0 = no errors (warnings allowed), 1 = at least one error.
 *
 * Checks, for every .html file under backoffice-ui-designs/:
 *   1. SYNTAX   Every inline <script> parses (catches e.g. missing commas in i18n dictionaries).
 *   2. I18N     Every data-i18n="key" used in the page exists in both `es` and `en`,
 *               and `es` / `en` dictionaries have the same keys (parity).
 *   3. LINKS    Every relative href / src (and url(...) in inline styles) points to an existing file.
 *
 * No dependencies: only Node's standard library.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const IGNORED_DIRS = new Set(['node_modules', '.git', '.agents', 'scripts']);

const errors = [];
const warnings = [];

const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

/** Returns [{ code, startLine }] for inline (non-src, non-JSON) scripts. */
function extractInlineScripts(html) {
  const result = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = (attrs.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (type && !/javascript|module/i.test(type)) continue;
    const codeStart = m.index + m[0].indexOf('>') + 1;
    result.push({ code: m[2], startLine: lineOf(html, codeStart) });
  }
  return result;
}

// ---------------------------------------------------------------- 1. SYNTAX
function checkSyntax(file, scripts) {
  scripts.forEach((s, i) => {
    try {
      new vm.Script(s.code, { filename: file });
    } catch (err) {
      // err.stack starts with "file:line"; derive the absolute HTML line.
      const m = /:(\d+)\b/.exec(err.stack || '');
      const line = m ? s.startLine + Number(m[1]) - 1 : s.startLine;
      errors.push(`${rel(file)}:${line}  SYNTAX  (script #${i + 1}) ${err.message}`);
    }
  });
}

// ------------------------------------------------------------------ 2. I18N
/**
 * Extracts the `i18n` dictionary object literal from a script and evaluates it
 * in an isolated context. Returns { es: {...}, en: {...} } or null.
 */
function extractDictionary(scripts) {
  for (const s of scripts) {
    const start = s.code.search(/\b(?:const|let|var)\s+i18n\s*=\s*\{/);
    if (start === -1) continue;
    const braceStart = s.code.indexOf('{', start);
    let depth = 0, inStr = null, esc = false, end = -1;
    for (let i = braceStart; i < s.code.length; i++) {
      const c = s.code[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === inStr) inStr = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) { end = i; break; }
    }
    if (end === -1) continue;
    try {
      return vm.runInNewContext('(' + s.code.slice(braceStart, end + 1) + ')', {}, { timeout: 1000 });
    } catch {
      return null; // syntax errors are already reported by checkSyntax
    }
  }
  return null;
}

function checkI18n(file, html, scripts) {
  const used = new Map(); // key -> first line
  const re = /data-i18n(?:-[a-z]+)?\s*=\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) if (!used.has(m[1])) used.set(m[1], lineOf(html, m.index));

  const dict = extractDictionary(scripts);
  if (!dict) {
    if (used.size) warnings.push(`${rel(file)}  I18N  uses ${used.size} data-i18n keys but no parseable \`i18n\` dictionary was found`);
    return;
  }

  const langs = Object.keys(dict);
  const es = new Set(Object.keys(dict.es || {}));
  const en = new Set(Object.keys(dict.en || {}));

  for (const [key, line] of used) {
    for (const lang of langs) {
      if (!(key in dict[lang])) errors.push(`${rel(file)}:${line}  I18N  key "${key}" is missing in "${lang}"`);
    }
  }
  for (const key of es) if (!en.has(key)) errors.push(`${rel(file)}  I18N  key "${key}" exists in "es" but not in "en"`);
  for (const key of en) if (!es.has(key)) errors.push(`${rel(file)}  I18N  key "${key}" exists in "en" but not in "es"`);

  const unused = [...es].filter((k) => !used.has(k) && !k.startsWith('nav_'));
  if (unused.length && process.argv.includes('--unused')) {
    warnings.push(`${rel(file)}  I18N  ${unused.length} keys defined but not used in markup: ${unused.slice(0, 8).join(', ')}${unused.length > 8 ? ', …' : ''}`);
  }
}

// ----------------------------------------------------------------- 3. LINKS
function checkLinks(file, rawHtml) {
  // Blank out <script> bodies (keeping newlines) so JS strings are not treated as page links.
  const html = rawHtml.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, a, body, c) => a + body.replace(/[^\n]/g, ' ') + c);
  const refs = [];
  const attrRe = /\b(href|src)\s*=\s*"([^"]*)"|\b(href|src)\s*=\s*'([^']*)'/gi;
  let m;
  while ((m = attrRe.exec(html))) refs.push({ value: m[2] ?? m[4], index: m.index });
  const urlRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  while ((m = urlRe.exec(html))) refs.push({ value: m[1], index: m.index });

  const seen = new Set();
  for (const { value, index } of refs) {
    let v = value.trim();
    if (!v || v.startsWith('#')) continue;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(v)) continue; // http:, https:, mailto:, tel:, javascript:, data:, wa.me via https
    if (/\$\{|\{\{/.test(v)) continue;                      // JS template strings
    v = v.split('#')[0].split('?')[0];
    if (!v) continue;
    const target = path.resolve(path.dirname(file), decodeURI(v));
    const key = `${index}:${target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!fs.existsSync(target)) {
      errors.push(`${rel(file)}:${lineOf(html, index)}  LINK  "${value}" does not exist`);
    }
  }
}

// --------------------------------------------------------------------- main
const files = walk(ROOT).sort();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = extractInlineScripts(html);
  checkSyntax(file, scripts);
  checkI18n(file, html, scripts);
  checkLinks(file, html);
}

console.log(`Checked ${files.length} HTML files in ${rel(ROOT) || '.'}\n`);
for (const w of warnings) console.log(`⚠  ${w}`);
for (const e of errors) console.log(`✖  ${e}`);
console.log(`\n${errors.length ? '✖' : '✔'} ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
