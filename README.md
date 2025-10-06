# HTX SWE Take Home Project

## Overview
This project is a full-stack task management application with:
- **Backend**: Node.js + TypeScript + PostgreSQL
- **Frontend**: React + Vite
- **LLM Integration**: Gemini API for skill extraction

All services are containerized using Docker and orchestrated via `docker-compose`.

---

## Prerequisites
- Docker
- Docker Compose
- Node.js (for local dev, optional)

---

## Running the Project

### 1. Clone the repository
```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Environment variables
Create `.env` in `backend/` with:
```
DB_USER=postgres
DB_HOST=db
DB_NAME=tasks
DB_PORT=5432
LLM_KEY=<your-gemini-key>
```

### 3. Start all services
```bash
docker-compose up --build
```
- Backend API: http://localhost:3001
- Frontend: http://localhost:5173
- PostgreSQL DB: localhost:5432 (user: postgres, trust authentication)

### 4. Stop services
```bash
docker-compose down
```

---

## Notes
- Do **not** mount host `node_modules` in Docker to avoid `esbuild` platform issues.
- Frontend Vite server is configured to bind to `0.0.0.0` for Docker accessibility.
- PostgreSQL uses `trust` authentication for simplicity in Docker.

---

## Directory Structure
```
backend/       # Backend source code, Dockerfile, .env
frontend/      # Frontend source code, Dockerfile
db/            # Database schema and seed SQL files
docker-compose.yml
.gitignore
README.md
```

---

## Commands
- Backend dev: `npm run dev` (inside backend container)
- Frontend dev: `npm run dev` (inside frontend container)
- Rebuild containers: `docker-compose build --no-cache`
- Remove volumes: `docker-compose down -v`

