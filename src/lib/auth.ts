import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAILS = [
    "mat3740@gmail.com", // Add your designated user emails here
];

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            const userEmail = user.email?.toLowerCase().trim();
            const allowedEmails = ALLOWED_EMAILS.map(e => e.toLowerCase().trim());

            // Only allow designated emails to sign in to maintain application security
            if (userEmail && allowedEmails.includes(userEmail)) {
                return true;
            }
            console.warn(`Unauthorized login attempt by: '${user.email}'`);
            return false;
        },
    },
    pages: {
        // Redirection on sign in if needed, but we handle via client
        signIn: '/config',
        error: '/config?error=AccessDenied',
    }
};
