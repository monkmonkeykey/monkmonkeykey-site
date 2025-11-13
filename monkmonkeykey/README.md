# MonkMonkeyKey Website

Sitio institucional construido con Next.js 16 y el App Router. Carga contenido bilingüe (español/inglés) para servicios, clientes y proyectos, y puede funcionar únicamente con los archivos Markdown del repositorio o con un backend opcional en MongoDB + Cloudinary para gestión desde un panel administrativo.

## Requisitos
- Node.js 18+
- npm 10+

## Puesta en marcha local
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de ejemplo de variables de entorno y complétalo con tus credenciales:
   ```bash
   cp .env.example .env.local
   ```
3. Lanza el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) para ver el sitio público.

## Variables de entorno
| Variable | Descripción |
| --- | --- |
| `MONGODB_URI` | Cadena de conexión a tu clúster de MongoDB Atlas o instancia propia. |
| `MONGODB_DB` | Nombre de la base de datos donde se guardarán clientes y proyectos. |
| `MONGODB_TLS` | Forzar conexiones TLS cuando tu servidor no lo exige por defecto (por ejemplo, instancias locales). |
| `MONGODB_TLS_ALLOW_INVALID_CERTIFICATES` | Permitir certificados TLS no válidos (útil para entornos de prueba con CA propia). |
| `MONGODB_TLS_ALLOW_INVALID_HOSTNAMES` | Omitir la validación de hostname en el certificado TLS. |
| `MONGODB_TLS_CA_FILE` | Ruta absoluta al archivo CA que firmó el certificado del servidor MongoDB. |
| `ADMIN_PASSWORD` | Contraseña que usarás para acceder al panel administrativo. |
| `ADMIN_SESSION_SECRET` | Cadena aleatoria larga para firmar las sesiones del panel. |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de tu cuenta de Cloudinary. |
| `CLOUDINARY_API_KEY` | API key con permisos de subida. |
| `CLOUDINARY_API_SECRET` | API secret asociado a la key. |

Si no configuras MongoDB, el sitio seguirá leyendo los archivos Markdown de `content/`. Si no configuras Cloudinary, podrás seguir pegando URLs manualmente para las imágenes y videos.

## Panel administrativo
1. Arranca la aplicación (en modo desarrollo o producción) y ve a [`/admin/login`](http://localhost:3000/admin/login).
2. Introduce la contraseña definida en `ADMIN_PASSWORD`. Se creará una sesión firmada con `ADMIN_SESSION_SECRET`.
3. Una vez dentro, podrás:
   - Crear, actualizar y eliminar clientes, instituciones o aliados.
   - Crear, actualizar y eliminar proyectos, incluidas galerías de imágenes, metadatos y videos opcionales de YouTube/Vimeo.
   - Subir medios a Cloudinary directamente desde los formularios (si las credenciales están presentes).
4. Los cambios se guardan en MongoDB; el sitio público los mostrará tras recargar o al reconstruir.

> **Nota:** sin MongoDB el panel sólo mostrará el contenido existente en los Markdown, pero no permitirá guardar cambios.

Para cerrar sesión usa el botón “Cerrar sesión” dentro del panel o borra la cookie `mmk_admin_session`.

## Scripts disponibles
- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera el build de producción.
- `npm run start`: arranca el servidor en modo producción (requiere `npm run build` previo).
- `npm run lint`: ejecuta ESLint sobre el proyecto.

## Estructura relevante
- `content/` – Entradas Markdown usadas como respaldo estático.
- `src/app/` – Rutas públicas y del panel (App Router).
- `src/components/` – Componentes compartidos del sitio.
- `src/server/` – Integraciones con MongoDB, Cloudinary y utilidades de autenticación.
- `src/data/` – Capa de lectura que prioriza MongoDB y recurre a Markdown si no hay base de datos.

## Despliegue
El proyecto es compatible con Vercel y cualquier entorno que soporte aplicaciones Next.js 16. Asegúrate de definir las mismas variables de entorno usadas en local.
