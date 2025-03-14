import {useState, useEffect} from "react";

import {Game} from "@/types/chesscom";

const padMonth = (month: number) => month.toString().padStart(2, "0");

interface GamesPeriod {
  year: number;
  month: number;
}

const useChessComGames = (username: string, gamesPeriod: GamesPeriod) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      if (!username || !gamesPeriod) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.chess.com/pub/player/${username}/games/${gamesPeriod.year}/${padMonth(gamesPeriod.month)}`,
        );
        const data = await response.json();

        setGames((data.games || []).reverse());
      } catch (err) {
        setError("No games found.");
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [username, gamesPeriod]);

  return {games, loading, error};
};

export default useChessComGames;
