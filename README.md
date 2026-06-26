# URL-Shortner backend project like: bitly

A backend URL shortener service with user authentication, built with Express and PostgreSQL.

## Features

- Shorten long URLs into compact, shareable links
- Redirect from short codes to original URLs
- User authentication (signup/login) with JWT
- Password hashing with bcrypt
- PostgreSQL database with Drizzle ORM

## Tech Stack

- **Runtime:** Node.js
- **Package Manager:** pnpm
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Auth:** JWT (jsonwebtoken), bcryptjs
- **Validation:** Zod
- **Short code generation:** nanoid

## Prerequisites

- Node.js installed
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database (local or hosted)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shreejankranjitkar/url-shortner.git
cd url-shortner
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Push the database schema

```bash
pnpm db:push
```

### 5. Run the server

For development (with auto-reload):

```bash
pnpm dev
```

For production:

```bash
pnpm start
```

## Scripts

| Script           | Description                          |
|-------------------|---------------------------------------|
| `pnpm start`      | Run the server with Node              |
| `pnpm dev`        | Run the server with nodemon (auto-reload) |
| `pnpm db:push`    | Push Drizzle schema to the database  |
| `pnpm db:studio`  | Open Drizzle Studio to view/manage DB |

## Project Structure

```
src/
├── server.js        # App entry point
├── ...               # Routes, controllers, models, middleware
```

