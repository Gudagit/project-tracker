# Project Tracker

A simple full-stack app for tracking clients and their projects.

## Stack

- **Backend**: Node.js, Express 5, Prisma (SQLite)
- **Frontend**: React 18, Vite

## Project structure

```
backend/    Express API + Prisma schema/migrations
frontend/   React + Vite client
```

## Getting started

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

The API runs on `http://localhost:3000` by default. Configure `backend/.env` with a `DATABASE_URL` (see `.env` for an example using SQLite).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## API endpoints

| Method | Endpoint         | Description            |
| ------ | ---------------- | ----------------------- |
| GET    | `/clients`        | List all clients        |
| POST   | `/clients`        | Create a client          |
| PUT    | `/clients/:id`     | Update a client          |
| DELETE | `/clients/:id`     | Delete a client          |
| GET    | `/projects`        | List all projects (with client) |
| POST   | `/projects`        | Create a project         |
| PUT    | `/projects/:id`    | Update a project         |
| DELETE | `/projects/:id`    | Delete a project         |
