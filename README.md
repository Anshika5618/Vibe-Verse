# VibeVerse

A full-stack blogging platform with JWT authentication, database-driven post publishing, nested comments, likes, and role-based access control.

**Stack:** Next.js (Pages Router) · React · Node.js · PostgreSQL (Neon) · Prisma ORM · JWT · Tailwind CSS

---

## Features

- **Authentication** — Email/password registration and login with bcrypt password hashing and JWT sessions stored in HTTP-only cookies.
- **Role-based access control** — `USER` and `ADMIN` roles; post/comment edit and delete actions are restricted to the resource's author or an admin, enforced at the API layer (not just in the UI).
- **Post publishing** — Full CRUD for blog posts through an authenticated UI (write, edit, delete), rendered as MDX with syntax highlighting, tags, and cover images.
- **Nested comments** — Threaded/reply comments on posts, built with a self-referential schema and a flat-fetch-then-tree-build query pattern to avoid N+1 queries.
- **Likes** — Toggleable per-user likes on posts, enforced unique at the database level via a compound constraint.
- **ISR (Incremental Static Regeneration)** — Post pages are statically generated and revalidated in the background, keeping the site fast while staying up to date with new content.

---

## Architecture

Posts, comments, likes, and users are all stored in PostgreSQL and accessed through Prisma. The blog homepage and post pages use Next.js `getStaticProps`/`getStaticPaths` with `revalidate: 60` (ISR) — statically generated for speed, but regenerated in the background at most once a minute so new/edited posts appear without a full redeploy.

Authentication uses signed JWTs stored in HTTP-only, `SameSite=Lax` cookies (not `localStorage`, to reduce XSS token-theft risk). An `authorId` prop is passed to the post detail page so the client only affects UI (showing/hiding an "Edit" link); the actual authorization check is repeated server-side on every write endpoint via `lib/withAuth.js`, so client-side checks are UX only, not the security boundary.

### Database schema

```
User
 ├─ id, email, username, password (hashed), role (USER | ADMIN)
 ├─ posts       → Post[]
 ├─ comments    → Comment[]
 └─ likes       → Like[]

Post
 ├─ id, title, slug (unique), content, description, image, tags[], readTime
 ├─ published, createdAt, updatedAt
 ├─ author      → User
 ├─ comments    → Comment[]
 └─ likes       → Like[]
 Indexes: authorId, published, createdAt

Comment
 ├─ id, content, createdAt, updatedAt
 ├─ author      → User
 ├─ post        → Post
 └─ parent      → Comment?  (self-relation, enables threaded replies)
 Indexes: postId, authorId, parentId

Like
 ├─ id, createdAt
 ├─ user        → User
 └─ post        → Post
 Unique constraint: (userId, postId) — prevents duplicate likes at the DB level
 Index: postId
```

All foreign keys cascade on delete (deleting a post removes its comments and likes automatically).

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Log in |
| POST | `/api/auth/logout` | — | Clear session cookie |
| GET | `/api/auth/me` | Required | Get current user |
| GET | `/api/posts` | — | List published posts (paginated) |
| POST | `/api/posts` | Required | Create a post |
| GET | `/api/posts/[id]` | — | Get a post by ID (includes `liked` state if authenticated) |
| PUT | `/api/posts/[id]` | Author/Admin | Update a post |
| DELETE | `/api/posts/[id]` | Author/Admin | Delete a post |
| GET | `/api/posts/slug/[slug]` | — | Get a post by slug |
| GET | `/api/posts/[id]/comments` | — | Get a post's comments as a nested tree |
| POST | `/api/posts/[id]/like` | Required | Toggle like on a post |
| POST | `/api/comments` | Required | Create a comment or reply |
| DELETE | `/api/comments/[id]` | Author/Admin | Delete a comment (cascades to replies) |

---

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Database** — create a free [Neon](https://neon.tech) Postgres project and copy its connection string.

3. **Environment variables** — create `.env` and `.env.local`, both containing:
   ```
   DATABASE_URL="postgresql://..."
   JWT_SECRET="<openssl rand -hex 32, or: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   (Prisma CLI reads `.env`; Next.js reads `.env.local` — both need the same values.)

4. **Migrate the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed initial content** (optional — populates the DB with the sample posts from `content/*.mdx`)
   ```bash
   node prisma/sync-content-posts.js
   ```

6. **Run the dev server**
   ```bash
   npm run dev
   ```

---

## Project structure

```
components/       Reusable UI (Navbar, Layout, BlogCard, CommentSection, ...)
lib/               Shared server logic (prisma client, auth helpers, withAuth middleware, useUser hook)
pages/
  api/             REST API routes
    auth/          register, login, logout, me
    posts/         CRUD, slug lookup, comments, like
    comments/      create, delete
  blog/            Post listing, detail, new, edit pages
prisma/
  schema.prisma    Data model
  migrations/      Migration history
  sync-content-posts.js   One-time script to load content/*.mdx into the database
content/           Original MDX source files (used only by the sync script now)
```

---

## Possible next steps

- Rich text / MDX editor in the "New Post" form instead of a raw textarea
- Pagination UI on the homepage (currently capped at the 20 most recent posts)
- Image upload instead of requiring an external image URL
- Rate limiting on auth endpoints
- Automated tests (API route tests with a test database)