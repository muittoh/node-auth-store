# Node Auth Store

API REST de autenticación y tienda con **Node.js, TypeScript, Express y MongoDB**. Incluye registro y login de usuarios, contraseñas encriptadas, JWT, verificación de correo por enlace, rutas protegidas, categorías y productos con paginación. Proyecto de práctica del curso de Node de DevTalles.

## Requisitos

- [Node.js](https://nodejs.org) 22 o superior (recomendado: la versión LTS actual)
- [Docker](https://www.docker.com/products/docker-desktop) y Docker Compose

## Instalación

1. Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/muittoh/node-auth-store.git
cd node-auth-store
npm install
```

2. Crea tu archivo de variables de entorno a partir de la plantilla y rellénalo:

```bash
cp .env.template .env
```

3. Levanta la base de datos:

```bash
docker compose up -d
```

4. Pobla la base de datos con datos de ejemplo (opcional):

```bash
npm run seed
```

> Borra los datos existentes; úsala solo con tu base local.

5. Arranca el servidor en modo de desarrollo:

```bash
npm run dev
```

El servidor queda disponible en: `http://localhost:<PORT>`.

## Scripts

- `npm run dev`: servidor en desarrollo con recarga automática.
- `npm run build`: compila TypeScript a `dist/`.
- `npm start`: ejecuta la versión compilada.
- `npm run typecheck`: comprueba los tipos sin generar archivos.
- `npm run seed`: borra los datos y carga datos de ejemplo (solo desarrollo).

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
| `POST` | `/api/upload/single/:type`        | No        | Sube un archivo                 |
| `POST` | `/api/upload/multiple/:type`      | No        | Sube varios archivos            |
| `GET`  | `/api/images/:type/:img`          | No        | Devuelve una imagen guardada    |

## Cómo usarlo

El flujo típico de la API es: registrarte, verificar tu correo, iniciar sesión y usar el token en las rutas protegidas. En Postman, para usar las rutas protegidas, usa la pestaña **Authorization**, elige **Bearer Token** y pega el token. Sin un token válido, la API responde `401`. Los listados de categorías y productos se pueden paginar con dos parámetros, que se envían en la URL (en Postman, en la pestaña **Params**):

- `page`: número de página, empezando en 1.
- `limit`: cuántos resultados se devuelven por página.

Para la subida de archivos, se envían como **Body → form-data**, con una clave llamada `file` cuyo tipo sea **File**. Para subir varios, usa la ruta múltiple con el mismo nombre de clave. La respuesta incluye el nombre con el que se guardó cada archivo.

## Notas

- `tsx` ejecuta TypeScript sin comprobar tipos. Usa `npm run typecheck` para verificarlos.
