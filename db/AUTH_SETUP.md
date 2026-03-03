# Google OAuth & NextAuth Setup

We are using NextAuth.js (v4) to manage authentication, restricting access to a predefined list of emails to ensure only you can manage your collection.

## 1. Create Google Cloud OAuth Credentials
To use Google as an authentication provider, you need a Client ID and Client Secret from the Google Cloud Console.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `MW Vault Auth`).
3. Search for "APIs & Services" -> "OAuth consent screen".
    - Choose **External** user type and click Create.
    - Fill in required fields (App name, User support email, Developer contact email) and Save. No need to add specific scopes beyond the default ones.
4. Go to "Credentials" in the left sidebar.
5. Click **Create Credentials** -> **OAuth client ID**.
6. Select **Web application** as the application type.
7. Name it appropriately (e.g., `MW Vault Web`).
8. Add Authorized redirect URIs. This is CRITICAL.
    - **For Local Development:** `http://localhost:3000/api/auth/callback/google`
    - **For Vercel Production:** `https://your-vercel-domain.vercel.app/api/auth/callback/google`
9. Click **Create**.
10. You will be shown a **Client ID** and **Client Secret**. Keep this modal open for the next step.

## 2. Setting Environment Variables
You need to add these values to both your local `.env.development.local` file and your Vercel project's Environment Variables.

Add the following:
```bash
# Local: http://localhost:3000 | Vercel: Your production URL
NEXTAUTH_URL="http://localhost:3000"

# Generate a random string for this (e.g. run `openssl rand -base64 32` in your terminal)
NEXTAUTH_SECRET="your_generated_secret_here"

# Your Google OAuth keys
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 3. Allowed User List
By default `mat.wardill@gmail.com` is hardcoded as the only allowed email address in `src/app/api/auth/[...nextauth]/route.ts`. Anyone else trying to log in will be rejected. You can add more addresses to the `ALLOWED_EMAILS` array in that file if needed.
