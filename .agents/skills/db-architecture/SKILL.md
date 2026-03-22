---
name: db-architecture
description: Guidelines for database query architecture in Next.js Server Actions and Route handlers to ensure separation of concerns.
license: MIT
metadata:
  version: '1.0.0'
---

# Database Architecture Guidelines

Enforce strict architectural boundaries for database queries to prevent raw SQL or Drizzle ORM calls from leaking into UI components or root route folders.

## Rule: Isolate DB Interactions

- **Never** place direct database calls (`db.select`, `db.insert`, `db.delete`, etc.) inside Next.js route files (`page.tsx`, `layout.tsx`, `route.ts`).
- **Never** place direct database calls inside top-level `actions.ts` or `mutations.ts` files that sit alongside pages.
- **Always** encapsulate database queries and business logic inside dedicated utility files in the `src/lib/db/` directory.
- Your `actions.ts` files in the Next.js `app/` directory should *only* serve as a "Server Action wrapper" to expose the `lib/db/` functions securely across the network. They are responsible only for session validation, invoking the `lib/db/` method, and triggering cache revalidations like `revalidatePath()`.
