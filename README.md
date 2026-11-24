# Node Auth Store

API REST de autenticació y tienda con **Node.js, TypeScript, Express y MongoDB**. Incluye registro y login de usuarios, constraseñas encriptadas, JWT, verificación de correo por enlace, rutas protegidas, categorías y productos con paginación. Proyecto de práctica del curso de Node de DevTalles.

## Instalación

1. Clona el repositorio e instala las dependencias:

```bash
git clone <URL del repositorio>
cd node-auth-store
npm install
```

2. Crea tu archivo de variables de entorno a partir de la plantilla y rellénalo:

```bash
cp .env-template .env
```

3. Levanta la base de datos:

```bash
docker compose up -d
```

4. Pobla la base de datos con datos de ejemplo (opcional):

```bash
npm run seed
```

5. Arranca el servidor en modo de desarrollo:

```bash
npm run dev
```

El servidor queda disponible en: `http://localhost:<PORT>`.

## Características

- Registro de usuario con contraseña encriptada.
- Verificación de correo mediante un enlace con token.
- Login que devuelve un JWT.
- Middleware de autenticación para proteger rutas.
- CRUD parcial de categorías y productos, con relaciones entre usuario, categoría y producto.
- Paginación en los listados.
- Semilla para poblar la base de datos con datos de ejemplo.
- Activar o desactivar el envío real de correos (`SEND_EMAIL`).

## Variables de entorno

Están descritas en `.env.template`. Las principales:

- `PORT`,
- `NODE_ENV`: entorno de ejecución (`development` o `production`),
- `MONGO_URL`: cadena de conexión a MongoDB,
- `MONGO_DB_NAME`,
- `MONGO_USER`: usuario de MongoDB (usado por Docker),
- `MONGO_PASSWORD`: contraseña de MongoDB (usada por Docker),
- `JWT_SEED`: semilla con la que se firman los tokens,
- `MAILER_SERVICE`: proveedor de correo (por ejemplo, `gmail`),
- `MAILER_EMAIL`: cuenta desde la que se envían los correos,
- `MAILER_SECRET_KEY`: contraseña de aplicación de esa cuenta. Si usas Gmail, créala en [myaccount.google.com/apppasswords](https://myaccount.google.com/u/0/apppasswords) (requiere tener activada la verificación en dos pasos),
- `SEND_EMAIL`: `true` para enviar correos reales, `false` para simular el envío,
- `WEBSERVICE_URL`: URL pública del servidor, usada para construir el enlace de verificación,

> **Importante:** `JWT_SEED` firma los tokens. Si se filtra, cualquiera puede fabricar tokens válidos. Usa un valor largo y aleatorio, y no lo hagas público. El archivo `.env` está en el `.gitignore`.

## Cómo usarlo

El flujo típico de la API es: registrarte, verificar tu correo, iniciar sesión y usar el token en las rutas protegidas. Los ejemplos usan `curl`, pero sirven igual en Postman.

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Ejemplo", "email": "ejemplo@correo.com", "password": "123456"}'
```

Si `SEND_EMAIL=true`, recibirás un correo con un enlace para validar tu dirección. Con `SEND_EMAIL=false`, el envío se simula y no llega ningún correo.

### 2. Verificar el correo

Abre el enlace del correo, que apunta a `WEBSERVICE_URL` seguido de la ruta de validación con tu token. Para abrirlo desde otro dispositivo (por ejemplo, el celular) durante el desarrollo, puedes exponer tu puerto local con [ngrok](https://ngrok.com) o con los _Ports_ de VS Code, y poner esa URL en `WEBSERVICE_URL`.

### 3. Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ejemplo@correo.com", "password": "123456"}'
```

La respuesta incluye un `token`. Guárdalo para las siguientes peticiones.

### 4. Usar rutas protegidas

Envía el token en el encabezado `Authorization`:

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"name": "Test", "available": true}'
```

En Postman, usa la pestaña **Authorization**, elige **Bearer Token** y pega el token. Sin un token válido, la API responde `401`.

### 5. Consultar con paginación

```bash
curl "http://localhost:3000/api/categories?page=1&limit=10"
```

- `page`: número de página, empezando en 1.
- `limit`: cuántos resultados por página.

## Endpoints

| Método | Ruta                              | Protegida | Descripción                     |
| ------ | --------------------------------- | --------- | ------------------------------- |
| `POST` | `/api/auth/register`              | No        | Registra un usuario             |
| `POST` | `/api/auth/login`                 | No        | Inicia sesión y devuelve un JWT |
| `GET`  | `/api/auth/validate-email/:token` | No        | Valida el correo del usuario    |
| `GET`  | `/api/categories`                 | No        | Lista las categorías (paginado) |
| `POST` | `/api/categories`                 | Sí        | Crea una categoría              |
| `GET`  | `/api/products`                   | No        | Lista los productos (paginado)  |
| `POST` | `/api/products`                   | Sí        | Crea un producto                |

## Notas

- `tsx` ejecuta TypeScript sin comprobar tipos. Usa `npm run typecheck` para verificarlos.
