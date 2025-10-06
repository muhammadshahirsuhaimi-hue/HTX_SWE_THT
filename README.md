# HTX_SWE_THT

# Start DB
docker-compose up -d db
docker exec -it postgres_db psql -U postgres -d tasks

# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev