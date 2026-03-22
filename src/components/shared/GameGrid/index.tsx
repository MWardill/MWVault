import { GameGridRoot } from "./GameGridRoot";
import { GameGridSearch } from "./GameGridSearch";
import { GameGridList } from "./GameGridList";
import { GameGridPagination } from "./GameGridPagination";

export const GameGrid = GameGridRoot as typeof GameGridRoot & {
    Search: typeof GameGridSearch;
    List: typeof GameGridList;
    Pagination: typeof GameGridPagination;
};

GameGrid.Search = GameGridSearch;
GameGrid.List = GameGridList;
GameGrid.Pagination = GameGridPagination;

export { GameGridSearch, GameGridList, GameGridPagination };
