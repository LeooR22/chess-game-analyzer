"use client";

import {ChessBoardClient} from "@/app/chessboard-client";
import useChessComGames from "@/components/hooks/use-chess-com-games";

export function PageClient({
  params,
}: {
  params: {username: string; year: string; month: string; id: string};
}) {
  const {username, year, month, id} = params;

  const {games, loading, error} = useChessComGames(username, {year: +year, month: +month});

  if (loading) return <div>Loading...</div>;

  const game = games.find((game) => game.uuid === id);

  return <ChessBoardClient pgnProp={game?.pgn || ""} />;
}
