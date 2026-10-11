# Client & Project Tracker — portfolio copy (English, for employers)

Links: Live demo https://project-tracker-eight-snowy.vercel.app  |  Code https://github.com/Gudagit/project-tracker

## Title
Client & Project Tracker

## One-liner (card on the project grid)
A full-stack web app that helps freelancers keep track of their clients, project deadlines, progress and payments.

## Short description (2–3 sentences)
Client & Project Tracker is a full-stack CRUD application built with React, Node.js/Express and PostgreSQL. Freelancers can manage clients, create projects with deadlines, update progress and mark projects as paid, all through a clean, responsive interface backed by a validated REST API.

## Tech tags
React · Vite · JavaScript · Node.js · Express · REST API · PostgreSQL · Prisma · Neon · Vercel · Render

## Case study (project page)

### The problem
Freelancers often juggle several clients and projects at once, and end up tracking deadlines, progress and payments in scattered notes and spreadsheets. I wanted a small, focused tool that keeps all of it in one place.

### What I built
- **Client management** — add and remove clients with an optional email.
- **Project tracking** — link every project to a client, set a deadline, change its status (Not Started / In Progress / Done) and mark it as paid, all inline.
- **Data integrity** — a client with existing projects cannot be deleted; the API answers with a clear message instead of failing silently.
- **Responsive UI** — works on desktop and on mobile.

### Technical highlights
- Designed a relational data model (one client → many projects) with **Prisma** migrations on **PostgreSQL**.
- Built a **REST API** with Express 5, including input validation and a central error handler that maps errors to correct HTTP status codes (400, 404, 409, 500).
- Moved the database from local SQLite to a hosted Postgres instance (Neon) to make the app deployable.
- Configured **CORS** per environment and kept secrets in environment variables.
- **React** frontend with a small API layer, controlled forms, loading / empty / error states and prop-type checks; linted with ESLint.
- Deployed the frontend on **Vercel** and the API on **Render**.

### What I learned
How the pieces of a full-stack app fit together — from database schema and migrations, through API design and error handling, to a React client and deployment — and how much of good UX comes from handling the unhappy paths (validation, empty states, server errors).

### What I would add next
Authentication so every user sees only their own data, editing of clients, filtering and sorting, pagination, and automated tests.


## Note about the demo (small text under the Live demo button)
The API runs on a free tier, so the first request after a period of inactivity can take up to a minute to wake up.

## Alt texts for the images
- 00-cover-mockup: "Client & Project Tracker shown on a laptop browser and on a phone"
- 01-desktop: "Desktop view listing clients and projects with status and paid toggles"
- 02-adding-project: "Adding a new project with title, client and deadline"
- 03-mobile: "Mobile layout of the app"
