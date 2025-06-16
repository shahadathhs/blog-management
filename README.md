# BLOG MANAGEMENT PLATFORM

> A full-featured backend for managing blogs, users, comments, notifications, and views — built with NestJS, TypeScript, Prisma, PostgreSQL, Docker, and CI/CD pipelines.

> 🚧 Note: This project is still ongoing

---

## Table of Contents

- [Project Summary](#project-summary)
- [Live Links](#live-links)
- [Tech Stack](#tech-stack)
- [Makefile Usage](#makefile-usage)
- [CI/CD Pipeline](#ci/cd-pipeline)
- [How to Run Locally](#how-to-run-locally)
- [Environment Variables](#environment-variables)
- [API Docs](#api-docs)
- [Future Improvements](#future-improvements)

---

## Project Summary

This is a scalable, secure backend REST API designed for managing a modern blogging platform with features like:

- User registration, login (password & OAuth2 with Google)
- JWT authentication and authorization with roles (User, Admin, Moderator)
- Email verification and password reset
- Blog creation, publishing, tagging
- Nested comments and replies
- View tracking (authenticated & anonymous)
- Notification system for comments, replies, mentions, and blog publishing
- Extensible profile management for each user

---

## Live Links

- **Live API:** [https://blog-management-ss4f.onrender.com](https://blog-management-ss4f.onrender.com)
- **Swagger Docs:** [https://blog-management-ss4f.onrender.com/docs](https://blog-management-ss4f.onrender.com/docs)
- **ER Diagram:** [https://dbdiagram.io/d/Blog-Management-684f7d4b3cc77757c8fa3f12](https://dbdiagram.io/d/Blog-Management-684f7d4b3cc77757c8fa3f12)
- **GitHub Repo:** [github.com/shahadathhs/blog-management](https://github.com/shahadathhs/blog-management)

---

## Tech Stack

- **Language:** TypeScript
- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/))
- **Auth:** OAuth2 (Google), JWT
- **Containerization:** Docker & Docker Compose (using Node.js 22-slim and pnpm)
- **CI/CD:** GitHub Actions for automated linting, building, Prisma validation, and deployment to Render
- **Deployment:** [Render](https://render.com/)
- **Logging:** Winston + Chalk

---

## Makefile Usage

To simplify development, container management, and common operations, this project provides a `Makefile` with handy commands. Ensure Docker and Docker Compose are installed.

| Command      | Description                               |
| ------------ | ----------------------------------------- |
| `make up`    | Build and start services in detached mode |
| `make down`  | Stop and remove containers and volumes    |
| `make logs`  | Tail service logs                         |
| `make ps`    | List container status                     |
| `make build` | Build the Docker image locally            |
| `make push`  | Push the image to Docker Hub              |
| `make pull`  | Pull the latest image from Docker Hub     |
| `make shell` | Open a shell inside the `api` container   |
| `make prune` | Clean up unused Docker resources          |

Use these instead of direct `docker` or `docker-compose` commands.

---

## CI/CD Pipeline

A GitHub Actions workflow (`.github/workflows/ci-db-cd.yml`) automates:

1. **CI Checks** (on pull requests):

   - Lint with `pnpm lint`
   - Format validation with `pnpm format`
   - Build with `pnpm build`

2. **Prisma Validation** (on pull requests after CI):

   - Schema validation (`prisma:validate`)
   - Client generation (`prisma:generate`)
   - Schema formatting (`prisma:format`)

3. **Continuous Deployment** (on `main` branch pushes):

   - Triggers a Render deploy hook via a secure secret

This ensures code quality, schema integrity, and automated deployments.

---

## How to Run Locally

### 1. Clone the Repo

```bash
git clone https://github.com/shahadathhs/blog-management.git
cd blog-management
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Setup Environment Variables

Create a `.env` file and copy the content from `.env.example`:

```bash
cp .env.example .env
```

Update the values accordingly, especially `DATABASE_URL`, OAuth, and mail credentials.

### 4. Migrate Database

```bash
npx prisma migrate dev --name init
```

### 5. Start the Server

```bash
npm run start:dev
```

Server will be running at `http://localhost:8080`

---

## Environment Variables

```env
# Database
DATABASE_URL="postgres database"

# General
PORT=8080
NODE_ENV="development"

# JWT
JWT_SECRET=your_super_secret
JWT_EXPIRES_IN=1d

# Mail
MAIL_USER=email
MAIL_APP_PASSWORD=app_password

# OAuth
OAUTH_CLIENT_ID=oauth_id
OAUTH_CLIENT_SECRET=oauth_secret

# Frontend URLs
FRONTEND_EMAIL_VERIFY_URL=http://localhost:3000/auth/verify-email
FRONTEND_PASSWORD_RESET_URL=http://localhost:3000/auth/password-reset
```

---

## API Docs

Visit Swagger UI: [https://blog-management-ss4f.onrender.com/docs](https://blog-management-ss4f.onrender.com/docs)

---

## Future Improvements

- Admin dashboard (view/edit users, blogs, tags)
- Rate-limiting, throttling, and abuse protection
- Realtime notifications with WebSockets
- AI-generated tags and summaries for blogs
- Markdown/MDX support for blog content
- Support for image uploads via S3 or Cloudinary
