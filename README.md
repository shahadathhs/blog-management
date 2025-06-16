---

# BLOG MANAGEMENT PLATFORM

> A full-featured backend for managing blogs, users, comments, notifications, and views — built with NestJS, TypeScript, Prisma, and PostgreSQL.

---

## 🚧 Note: This project is still ongoing

### 🔗 Live API: [https://blog-management-ss4f.onrender.com](https://blog-management-ss4f.onrender.com)

### 📘 Swagger Docs: [https://blog-management-ss4f.onrender.com/docs](https://blog-management-ss4f.onrender.com/docs)

### 🧩 ER Diagram: [https://dbdiagram.io/d/Blog-Management-684f7d4b3cc77757c8fa3f12](https://dbdiagram.io/d/Blog-Management-684f7d4b3cc77757c8fa3f12)

### 💻 GitHub Repo: [github.com/shahadathhs/blog-management](https://github.com/shahadathhs/blog-management)

---

## 📌 Project Summary

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

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/))
- **Auth:** OAuth2 (Google), JWT
- **Deployment:** [Render](https://render.com/)
- **Logging:** Winston + Chalk

---

## 🌱 Models Overview

- **User**: Supports roles, OAuth2, email/password login, email verification, and reset tokens.
- **Profile**: One-to-one relation with `User`, extends user info (bio, avatar, location).
- **Blog**: Belongs to a `User`, can have multiple `Tags`, `Views`, `Comments`, and triggers `Notifications`.
- **Comment**: Supports nested replies and tracks edit status.
- **View**: Tracks blog views by user or anonymously with IP & user agent.
- **Tag**: Categorizes blogs with many-to-many relation via `BlogTag`.
- **Notification**: Notifies users of key actions (comment, reply, mention, etc.)

---

## 🚀 How to Run Locally

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

## 🔐 Example `.env` File

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

# Oauth
OAUTH_CLIENT_ID=oauth_id
OAUTH_CLIENT_SECRET=oauth_secret

# Frontend URL
FRONTEND_EMAIL_VERIFY_URL=http://localhost:3000/auth/verify-email
FRONTEND_PASSWORD_RESET_URL=http://localhost:3000/auth/password-reset
```

---

## 📄 API Docs

Visit Swagger UI: [https://blog-management-ss4f.onrender.com/docs](https://blog-management-ss4f.onrender.com/docs)

---

## 🧠 Future Improvements

- Admin dashboard (view/edit users, blogs, tags)
- Rate-limiting, throttling, and abuse protection
- Realtime notifications with WebSockets
- AI-generated tags and summaries for blogs
- Markdown/MDX support for blog content
- Support for image uploads via S3 or Cloudinary

---

## 📬 Contact

Feel free to reach out for feedback or collaboration!

---


