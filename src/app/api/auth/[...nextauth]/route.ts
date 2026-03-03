import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAILS = [
    "mat.wardill@gmail.com", // Add your designated user emails here
];

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            // Only allow designated emails to sign in to maintain application security
            if (user.email && ALLOWED_EMAILS.includes(user.email)) {
                return true;
            }
            console.warn(`Unauthorized login attempt by: ${user.email}`);
            return false;
        },
    },
    pages: {
        // Redirection on sign in if needed, but we handle via client
        signIn: '/config',
        error: '/config?error=AccessDenied',
    }
});

export { handler as GET, handler as POST };
