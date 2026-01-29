# Pastebin-Lite

A small Pastebin-like application built as a take-home assignment.  
Users can create text pastes, generate shareable links, and view them with optional
time-based expiry (TTL) and view-count limits.

Deployed URL:  
https://pastebin-management-5s9i.vercel.app/

---

## Technical Overview

This application is built using a full-stack Next.js architecture with a persistent
PostgreSQL backend and follows the exact specification provided in the assignment.

### Core Features

- Create a paste with arbitrary text
- Optional constraints:
  - Time-to-Live (TTL)
  - Maximum number of views
- Shareable URL for each paste
- API and HTML access to pastes
- Automatic expiration when any constraint is reached
- Deterministic time support for automated testing (`TEST_MODE`)
- Atomic view counting with database transactions
- Safe HTML rendering (no script execution)

---

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS

### Backend
- Next.js API Routes (Server Functions)
- Prisma ORM v7
- PostgreSQL (Neon Serverless)
- Zod (request validation)

### Persistence
- PostgreSQL hosted on Neon
- Prisma Adapter (`@prisma/adapter-pg`) for serverless-safe connections

---

## Design Decisions

### Why Next.js instead of plain Node.js?

1. **Single Codebase**
   - UI, API, and server logic live in one repository.
   - Simplifies deployment and environment management.

2. **Serverless Friendly**
   - Native support for Vercel serverless execution.
   - Automatic scaling and cold-start handling.

3. **Built-in Routing**
   - `/api/*` for backend
   - `/p/[id]` for HTML paste view
   - No need for separate Express server.

4. **Type Safety**
   - End-to-end TypeScript across UI, API, and database layer.

5. **Production-Grade Build System**
   - Static optimization
   - Edge-ready runtime
   - Deterministic builds for automated graders.

---

### Architecture

app/
├── page.tsx # Create Paste UI
├── p/[id]/page.tsx # HTML View Page
└── api/
├── healthz/route.ts
└── pastes/
├── route.ts # POST /api/pastes
└── [id]/route.ts # GET /api/pastes/:id

services/
└── paste.service.ts # TTL + View limit logic (transactional)

lib/
├── prisma.ts # Prisma v7 adapter setup
├── time.ts # TEST_MODE time override
└── id.ts # nanoid generator

validators/
└── paste.schema.ts # Zod validation


---

## Persistence Layer

The application uses **PostgreSQL hosted on Neon** with Prisma ORM.

Reasons:
- Durable across serverless invocations
- ACID transactions for correct view-count enforcement
- No in-memory state (required by assignment)
- Safe under concurrent access

---

## Deterministic Time for Testing

If the environment variable is set:

TEST_MODE=1


Then the request header:

x-test-now-ms: <milliseconds since epoch>


is used as the current time for TTL checks instead of `Date.now()`.

This allows automated graders to simulate expiry reliably.

---

## API Endpoints

### Health Check
GET /api/healthz
→ { "ok": true }


### Create Paste
POST /api/pastes
{
"content": "string",
"ttl_seconds": 60,
"max_views": 5
}
→ { "id": "...", "url": "https://.../p/<id>" }


### Fetch Paste (API)
GET /api/pastes/:id
→ { "content", "remaining_views", "expires_at" }


### View Paste (HTML)
GET /p/:id
→ Rendered paste content


All unavailable states return HTTP 404 with JSON (API) or 404 page (HTML).

---

## Running Locally

### 1. Clone

```bash
git clone https://github.com/RohithNagab7/pastebin-management
cd pastebin-management
2. Install Dependencies
npm install
3. Environment Variables
Create .env:

DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=0
4. Prisma Setup
npx prisma generate
npx prisma migrate dev
5. Run Development Server
npm run dev
Open:

http://localhost:3000
Build & Production
npm run build
npm run start
The project builds cleanly with strict TypeScript and is deployed on Vercel.

Notable Technical Points
Prisma transactions prevent race conditions on view limits

No global mutable state (serverless-safe)

No hardcoded localhost URLs in production

Zod ensures all invalid input returns proper 4xx JSON errors

Safe HTML rendering using React escaping

Deployed Application
Live URL:
https://pastebin-management-5s9i.vercel.app/

