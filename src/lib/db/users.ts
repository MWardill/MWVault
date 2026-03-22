import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAuthenticatedUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("User not authenticated");
    }
    const dbUsers = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (dbUsers.length === 0) {
        throw new Error("User not found in database");
    }
    return dbUsers[0].id;
}
