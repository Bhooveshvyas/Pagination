# CodeVector Backend Task

## Tech Stack

- Node.js
- Express
- PostgreSQL (Neon)
- Prisma ORM

## Features

- 200,000 products
- Category filtering
- Cursor based pagination
- Composite cursor (updatedAt + id)
- Indexed queries
- Stable ordering

## Run

npm install

npx prisma generate

npx prisma db push

npm run seed

npm start

## API

GET /products

GET /products?category=electronics

GET /products?cursorUpdatedAt=...&cursorId=...

GET /products?category=electronics&cursorUpdatedAt=...&cursorId=...