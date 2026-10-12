# YoReservo — Templates & Infrastructure Repository (`poc-yoreservo-templates`)

Repositorio centralizado de recursos estáticos, plantillas transaccionales, infraestructura local y prototipos de interfaz de usuario de alta fidelidad para el ecosistema **YoReservo**.

---

## 📌 Contenido del Repositorio

| Directorio | Propósito | Tecnologías / Formatos |
|---|---|---|
| [`database/`](#1-base-de-datos-local-database) | Entorno local de PostgreSQL listo para desarrollo | Docker Compose, PostgreSQL 16 Alpine |
| [`emails/`](#2-plantillas-de-correo-transaccional-emails) | Plantillas de correo responsive multi-idioma (ES / EN) | HTML Email, Inline CSS, VML |
| [`ui-designs/`](#3-prototipos-y-diseños-de-interfaz-ui-designs) | Prototipos navegables de pantallas de Auth y Mi Cuenta (Cliente) | HTML5, CSS3 Tokens, Vanilla JS |
| [`backoffice-ui-designs/`](./backoffice-ui-designs/README.md) | Especificaciones y prototipos de la consola de administración y recintos | HTML5, CSS3 Tokens, Vanilla JS |
| [`scripts/`](#4-scripts-scripts) | Scripts de utilidad, automatización y mantenimiento | Bash / Node / SQL |

---

## 1. Base de Datos Local (`database/`)

Contiene la definición del contenedor de PostgreSQL utilizado por el backend (`poc-yoreservo-backend-service`) para desarrollo local.

### Especificaciones del Contenedor

- **Imagen**: `postgres:16-alpine`
- **Nombre del contenedor**: `yoreservo-postgres`
- **Puerto expuesto en host**: `5433` *(mapeado al `5432` interno para evitar conflictos con instalaciones locales)*
- **Usuario**: `postgres`
- **Contraseña**: `postgres`
- **Base de datos**: `yoreservo`
- **Volumen persistente**: `yoreservo-db-data`

### Comandos de Uso

```bash
# Iniciar base de datos en segundo plano
cd database
docker compose up -d

# Ver registros en tiempo real
docker compose logs -f

# Detener el contenedor
docker compose down

# Detener y borrar volúmenes (reseteo completo)
docker compose down -v
```

---

## 2. Plantillas de Correo Transaccional (`emails/`)

Plantillas HTML de correo electrónico diseñadas para compatibilidad con los principales clientes (Gmail, Outlook Desktop y Web, Apple Mail, Yahoo) tanto en clientes móviles como de escritorio.

### Estructura de Plantillas

Cada plantilla cuenta con versiones en **Español (`-es.html`)** e **Inglés (`-en.html`)**:

- **`welcome/`**:
  - `welcome-es.html` / `welcome-en.html`: Correo de bienvenida tras el registro con botón de acción directa *"Verificar mi correo"* y expiración de 24 horas.
- **`pre-reservation/`**:
  - `pre-reservation-es.html` / `pre-reservation-en.html`: Confirmación de reserva temporal con ventana de pago de 15 minutos, datos bancarios de Pago Móvil y tasa BCV.
- **`payment-verified/`**:
  - `payment-verified-es.html` / `payment-verified-en.html`: Notificación de pago aprobado, código QR de acceso y detalles de la cancha.
- **`recover-password/`**:
  - `recover-password-es.html` / `recover-password-en.html`: Enlace seguro para restablecimiento de contraseña (validez de 30 minutos).
- **`reservation-cancelled/`**:
  - `reservation-cancelled-es.html` / `reservation-cancelled-en.html`: Notificación de cancelación automática por vencimiento del tiempo de pago.

### Visor de Pruebas

Para previsualizar y validar todas las plantillas en un solo lugar, abre:
- **`emails/index.html`**: Galería interactiva con selector de idioma y render en vivo.

---

## 3. Prototipos y Diseños de Interfaz (`ui-designs/`)

Prototipos navegables en HTML/CSS basados en el Design System oficial de **`poc-yoreservo-client-web-app`** (`Outfit`, `Inter`, paleta de colores institucional, modo claro/oscuro y componentes Tailwind equivalentes).

### Estructura de Pantallas

```text
ui-designs/
├── index.html                   # Portal Maestro con acceso a todos los módulos
├── auth-ui-designs/             # Flujos de Autenticación y Verificación
│   ├── index.html               # Simulador interactivo en marco móvil/tablet/desktop
│   ├── check-email-signup.html  # Pantalla post-registro ("¡Revisa tu correo!")
│   ├── verify-email.html        # Simulador del flujo GET de verificación
│   ├── verify-email-success.html# Confirmación exitosa con redirección
│   ├── verify-email-error.html  # Error por token inválido o expirado
│   ├── reset-password.html      # Formulario para definir nueva contraseña
│   ├── reset-password-success.html # Confirmación de contraseña actualizada
│   └── reset-password-error.html   # Error de token de recuperación
└── my-account-ui-designs/       # Módulo "Mi Cuenta"
    ├── index.html               # Simulador interactivo del perfil de usuario
    ├── profile/                 # Perfil general y edición de datos
    ├── security/                # Cambio de contraseña y seguridad
    ├── payments/                # Métodos de pago y registro de tarjeta
    ├── favorites/               # Recintos deportivos guardados
    ├── about/                   # Acerca de la app, Términos y Privacidad
    └── support/                 # Centro de ayuda, reporte de bugs y sugerencias
```

### Características de los Prototipos

- **Layout Fiel a Producción**: Implementa el `AuthShell` (panel de marca con fondo de cancha + tarjeta elevada) y la barra de navegación móvil de Mi Cuenta.
- **Interactividad**: Validaciones en tiempo real de contraseña (mínimo 8 caracteres, mayúscula, número, coincidencia y detección de contraseña anterior), temporizadores de reenvío con cooldown de 30s y alertas toast.
- **Herramienta de Previsualización**: Visor interactivo con marcos de iPhone (`390px`), Tablet (`640px`) y Desktop Split (`1080px`), más toggle de tema claro / oscuro.

---

## 4. Scripts (`scripts/`)

Directorio destinado a utilidades auxiliares del proyecto:
- Scripts de migración o carga inicial de datos (seeders).
- Herramientas de compilación o inlining para plantillas de email.
- Utilidades para sincronización y despliegue en servicios en la nube (AWS SES, S3).

---

## 🔗 Relación con Otros Repositorios

- **`poc-yoreservo-client-web-app`**: Aplicación web frontend (Next.js / React / TailwindCSS) que implementa estos diseños de interfaz.
- **`poc-yoreservo-backend-service`**: Servicio backend (NestJS / Prisma) que consume el contenedor PostgreSQL de `database/` y envía los correos definidos en `emails/`.
