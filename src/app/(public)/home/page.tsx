import HomeClient from "./home-client";
import { getConsolesWithGameCounts } from "./actions";

export default async function Home() {
    const formattedResults = await getConsolesWithGameCounts();

    return <HomeClient initialItems={formattedResults} />;
}
