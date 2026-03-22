---
name: mwvault-spa-guidelines
description: Guidelines for Single Page Application (SPA) functionality and transitions in MWVault. Use this when implementing forms, navigation, buttons, and user interactions.
---

# MWVault SPA Guidelines

## Core Philosophy
MWVault is a modern web application built with Next.js App Router and utilizes `next-view-transitions` for seamless, native-feeling page transitions. It is critical that interactions feel fluid, without any jarring full-page HTML reloads.

## Best Practices

### 1. Avoid Full Page Refreshes
While standard native HTML elements (like `<form method="GET">` or `<a href="...">` tags) are robust, relying on them directly can bypass Next.js client-side routing, forcing a full browser reload and destroying the SPA router cache. **This breaks our seamless transitions.**

### 2. Client-side Forms & Navigation
- **Forms**: Instead of relying on native form submissions with `action` and `method` for routing, build your forms as React `"use client"` components. Intercept the submission via `onSubmit`, invoke `e.preventDefault()`, and manually map the interface payload to the URL or Server Action.
- **Pushing Updates**: Always use our SPA routing primitives applied gracefully:
  - We use the `next-view-transitions` library to augment routing. 
  - To push query parameters computationally, use `import { useTransitionRouter } from "next-view-transitions"` instead of Next's native router, and call `router.push()`.
- **Links**: Use the `<Link>` component strictly imported from `next-view-transitions` (not `next/link`) everywhere to preserve view transition momentum.

### 3. Graceful URL Updates
When adding things like Filters, Paging, or Searching to a page, build a small Client Component to intercept the user action and push query-parameters via `useTransitionRouter`. The wrapping Server Component will seamlessly receive the updated `searchParams` on the next React pass, instantly re-rendering without dropping application state.
