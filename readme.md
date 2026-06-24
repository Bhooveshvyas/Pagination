# CodeVector Backend Assignment

## Overview

This project is a backend service built for the CodeVector Internship Take-Home Task.

The system allows users to browse a large dataset of products (~200,000 records), filter products by category, and paginate efficiently using cursor-based pagination.

The implementation focuses on correctness, scalability, and consistency while data is changing.

---

## Tech Stack

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL (Neon)
* Render (Deployment)

---

## Features

### Product Browsing

* Browse products sorted by newest first.
* Returns products in descending order of `updatedAt` and `id`.

### Category Filtering

* Filter products using the `category` query parameter.

Example:

```http
GET /products?category=electronics
```

### Fast Pagination

* Implemented using cursor-based pagination instead of offset pagination.
* Efficient for large datasets (200,000+ records).
* Avoids performance degradation on deeper pages.

### Consistent Results During Data Changes

To prevent duplicates or missing products while a user is browsing:

* The first request generates a `snapshotTime`.
* Subsequent requests reuse the same `snapshotTime`.
* Only products with:

```text
updatedAt <= snapshotTime
```

are included in the browsing session.

This ensures that products inserted or updated after browsing begins do not affect the current pagination sequence.

### Database Optimizations

Indexes:

```prisma
@@index([category])
@@index([updatedAt, id])
@@unique([updatedAt, id])
```

These indexes improve filtering and pagination performance.

---

## API

### Get Products

```http
GET /products
```

Response:

```json
{
  "data": [],
  "snapshotTime": "2026-06-24T03:35:30.316Z",
  "nextCursor": {
    "updatedAt": "2026-06-23T05:37:49.111Z",
    "id": "cmqq7ql534ab0e59bgpobja38"
  }
}
```

### Next Page

```http
GET /products?snapshotTime=<snapshotTime>&cursorUpdatedAt=<updatedAt>&cursorId=<id>
```

### Category Filter

```http
GET /products?category=electronics
```

### Category Filter + Pagination

```http
GET /products?category=electronics&snapshotTime=<snapshotTime>&cursorUpdatedAt=<updatedAt>&cursorId=<id>
```

---

## Database Seeding

A dedicated seed script generates 200,000 products.

Each product contains:

* id
* name
* category
* price
* createdAt
* updatedAt

The script inserts records in batches using Prisma's `createMany()` for better performance.

Run:

```bash
node seed.js
```

---

## Design Decisions

### Why PostgreSQL?

PostgreSQL provides reliable indexing, sorting, and query performance for large datasets.

### Why Prisma?

Prisma offers type-safe database access and simplified schema management.

### Why Cursor Pagination?

Offset pagination becomes slower on large datasets because the database must skip many rows.

Cursor pagination provides:

* Better performance
* Stable ordering
* Scalability for large datasets

### Why Snapshot-Based Browsing?

Without snapshot consistency, newly inserted or updated products can shift page boundaries, causing duplicates or missing records.

Using a fixed snapshot time guarantees a consistent browsing experience.

---

## Future Improvements

Given more time, I would:

* Add automated tests
* Add API documentation using Swagger/OpenAPI
* Add request validation
* Add caching for frequently accessed queries
* Add monitoring and logging
* Build a small frontend interface for browsing products

---

## AI Usage

AI tools were used to:

* Explore pagination strategies
* Review Prisma schema design
* Validate indexing approaches
* Discuss trade-offs between offset and cursor pagination

All implementation decisions, debugging, testing, and final verification were performed manually.

---

## Author

Bhoovesh