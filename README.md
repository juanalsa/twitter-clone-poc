# Twitter Clone PoC

Este proyecto es una prueba de concepto (PoC) para una aplicación similar a Twitter, desarrollada con **Hono** y **Cloudflare Workers**, utilizando **NeonDB** como base de datos y **Cloudflare Queues** para el procesamiento de eventos asincrónicos.

## Características principales
- Backend con **Hono (TypeScript)**
- Almacenamiento en **NeonDB (PostgreSQL Serverless)**
- Uso de **Cloudflare Workers** para escalabilidad
- Procesamiento asincrónico con **Cloudflare Queues**
- Seguridad con **bcryptjs**

## Requisitos previos
Antes de iniciar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión recomendada: 18 o superior)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)
- [NeonDB](https://neon.tech/) para almacenamiento de datos
- Cuenta en [Cloudflare](https://dash.cloudflare.com/) para Workers y Queues

## Instalación
Clona el repositorio e instala las dependencias necesarias:

```sh
# Clonar el repositorio
git clone https://github.com/juanalsa/twitter-clone-poc.git
cd twitter-clone-poc

# Instalar dependencias
npm install
```

## Configuración

### 1. Variables de entorno
El archivo `dev.vars.template` proporciona una plantilla de variables de entorno necesarias. Crea un archivo `.dev.vars` y configúralo con los valores correspondientes:

```sh
DATABASE_URL="postgresql://usuario:password@host:puerto/db"
TWEET_QUEUE="queue-name"
```

### 2. Configuración de `wrangler.toml`
El archivo `wrangler.toml` contiene la configuración para desplegar el proyecto en Cloudflare:

```toml
name = "twitter-clone-poc"
main = "src/index.ts"
compatibility_date = "2024-02-15"

[[queues.producers]]
queue = "queue-name"
binding = "TWEET_QUEUE"

[[queues.consumers]]
queue = "queue-name"
max_batch_size = 10
max_batch_timeout = 5
```

Asegúrate de modificarlo si es necesario.

### 3. Base de datos
Puedes ver el diagrama de la base de datos en la siguiente imagen:

![Diagrama de BD](docs/diagrama_bd_app.jpg)

Ejecuta el script SQL para crear las tablas necesarias en NeonDB:

```sh
psql $DATABASE_URL -f scripts/create_tables.sql
```

## Uso y desarrollo
### Servidor de desarrollo
Para iniciar el entorno de desarrollo local, ejecuta:

```sh
npm run dev
```

### Despliegue
Para desplegar en Cloudflare Workers, usa:

```sh
npm run deploy
```

Esto subirá la aplicación a Cloudflare con optimización de código.

## Estructura del proyecto
```sh
twitter-clone-poc/
├── scripts/
│   └── create_tables.sql
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── tweet.controller.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.route.ts
│   │   └── tweet.route.ts
│   ├── utils/
│   │   ├── db.ts
│   │   ├── types.ts
│   │   └── validators.ts
│   ├── workers/
│   │   └── queue.worker.ts
│   └── index.ts
├── dev.vars
├── dev.vars.template
├── .gitignore
├── diagrama_bd_app.png
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── wrangler.toml
```

## API Endpoints

### Autenticación (`/auth`)
- `POST /auth/register` → Registra un nuevo usuario.
- `POST /auth/login` → Inicia sesión y genera un token de sesión.

### Tweets (`/tweets`)
- `POST /tweets/tweet` → Publica un nuevo tweet y envía un evento a la cola para procesar.

## Procesamiento de eventos en la cola
El proyecto utiliza un worker secundario `queue.worker.ts` se encarga de procesar eventos de menciones en tweets y notificar a los usuarios correspondientes.

## Ejemplos de Casos de Uso

### Registro de un nuevo usuario
![Diagrama de BD](docs/register_user_successful.jpg)

### Login de un usuario
![Diagrama de BD](docs/login_user_successful.jpg)

### Publicación de un nuevo tweet
![Diagrama de BD](docs/publish_tweet_successful.jpg)

## Contribución
Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:
1. Haz un **fork** del repositorio. 
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y haz commit (git commit -am 'Añade nueva funcionalidad').
4. Haz push a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un **Pull Request** con tus cambios.

## Licencia
Este proyecto está bajo la licencia **MIT**. Consulta el archivo **LICENSE** para más detalles.

---

Listo para desplegar 🚀
