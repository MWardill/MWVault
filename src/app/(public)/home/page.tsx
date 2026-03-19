import HomeClient from "./home-client";
import { getConsolesWithGameCounts } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
    // Fetch consoles and count games owned
    const formattedResults = await getConsolesWithGameCounts();

    return <HomeClient initialItems={formattedResults} />;
}
