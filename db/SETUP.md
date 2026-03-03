# Vercel Neon PostgreSQL Database Setup

The MW Vault application uses **Vercel Postgres**, which is powered by **Neon**, for its database requirements. This document outlines how to set this up for your application.

## Prerequisites
1. You must have deployed or be deploying your Next.js application to Vercel.
2. You need a Vercel account.

## Step 1: Provision the Database via Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your `mwvault` project.
3. Click on the **Storage** tab located in the top navigation bar of your project dashboard.
4. Click the **Create Database** button.
5. In the dialog that appears, select **Postgres** (Serverless SQL).
6. Click **Continue**.
7. Read and accept the terms, name your database (e.g., `mwvault-db`), and choose the region closest to your Vercel functions deployment region (usually `Washington, D.C. (iad1)` for default US East).
8. Click **Create**.

*Vercel will now provision a Neon Postgres database and automatically link the connection string environment variables to your project.*

## Step 2: Environment Variables

When you create the database via the Vercel dashboard, Vercel automatically populates the following environment variables in your project settings:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Local Development Setup
To pull these environment variables into your local `.env.development.local` file so you can connect to the remote database while running `npm run dev`:

1. Open your terminal in the project root.
2. Run the Vercel CLI link command:
   ```bash
   npx vercel link
   ```
3. Once linked, pull the environment variables down to your local machine:
   ```bash
   npx vercel env pull .env.development.local
   ```
*(Note: Ensure `.env.development.local` is in your `.gitignore` to prevent committing secrets).*

## Step 3: Package Installation

We will use the `@vercel/postgres` package to interact with the database.

1. Install the Vercel Postgres SDK:
   ```bash
   npm install @vercel/postgres
   ```

## Step 4: Run Initial Migrations (Schema)

To create the tables in your new database, we will execute the `schema.sql` script.

1. You can run the SQL script via the Vercel Dashboard directly:
    - Go to your Project -> Storage -> select your Postgres database.
    - Click on the **Data** or **Query** tab.
    - Copy the contents of `db/schema.sql` from your local project.
    - Paste it into the query runner and execute it.

Alternatively, if you prefer running it locally via Node script, you can create a setup script, but the Vercel dashboard query editor is the simplest approach for the initial setup.

## Next Steps
Once the database is provisioned, the environmental variables pulled locally, and the schema deployed, Phase 2 authentication and data access implementation can proceed.
