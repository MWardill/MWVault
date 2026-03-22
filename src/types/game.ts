export interface Game {
    id: number;
    title: string;
    imageUrl: string | null;
    summary: string | null;
    developer: string | null;
    releaseDate: string | null;
    currentPrice?: string | null;
}
