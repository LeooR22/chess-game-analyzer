"use client";

import type React from "react";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Calendar, Clock, Search, Trophy, User, ExternalLink} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import useChessComGames from "@/components/hooks/use-chess-com-games";

// Datos de ejemplo para el historial de partidas
const chessGames = [
  {
    id: 1,
    white: "Magnus Carlsen",
    black: "Hikaru Nakamura",
    result: "1-0",
    date: "2023-11-15",
    event: "Champions Chess Tour",
    opening: "Siciliana",
    moves: 42,
    timeControl: "15+10",
  },
  {
    id: 2,
    white: "Fabiano Caruana",
    black: "Magnus Carlsen",
    result: "½-½",
    date: "2023-10-28",
    event: "Sinquefield Cup",
    opening: "Ruy López",
    moves: 67,
    timeControl: "120+30",
  },
  {
    id: 3,
    white: "Hikaru Nakamura",
    black: "Ian Nepomniachtchi",
    result: "0-1",
    date: "2023-09-12",
    event: "Grand Chess Tour",
    opening: "Defensa Francesa",
    moves: 38,
    timeControl: "25+10",
  },
  {
    id: 4,
    white: "Ding Liren",
    black: "Alireza Firouzja",
    result: "1-0",
    date: "2023-08-05",
    event: "Torneo de Candidatos",
    opening: "Defensa India de Rey",
    moves: 54,
    timeControl: "120+30",
  },
  {
    id: 5,
    white: "Anish Giri",
    black: "Wesley So",
    result: "½-½",
    date: "2023-07-22",
    event: "Tata Steel Chess",
    opening: "Defensa Siciliana",
    moves: 45,
    timeControl: "90+30",
  },
  {
    id: 6,
    white: "Levon Aronian",
    black: "Viswanathan Anand",
    result: "0-1",
    date: "2023-06-18",
    event: "Norway Chess",
    opening: "Apertura Inglesa",
    moves: 39,
    timeControl: "120+10",
  },
];

export default function ChessHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("username") || "");
  const {games, loading, error} = useChessComGames(searchTerm, {year: 2025, month: 3});

  console.log(games, loading, error);

  // Función para actualizar la URL con el término de búsqueda
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`?username=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("");
    }
  };

  // Manejar evento de tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filtrar partidas según el término de búsqueda
  const filteredGames = games;

  // Función para formatear el control de tiempo
  const formatTimeControl = (timeControl: string) => {
    if (!timeControl) return "Desconocido";

    const [base, increment] = timeControl.split("+");

    return `${Number.parseInt(base) / 60} min ${increment ? `+ ${increment} seg` : ""}`;
  };

  // Función para formatear la fecha
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Función para obtener el nombre de la apertura desde la URL
  const getOpeningName = (ecoUrl?: string) => {
    if (!ecoUrl) return "Apertura desconocida";
    const parts = ecoUrl.split("/");

    return parts[parts.length - 1].replace(/-/g, " ");
  };

  // Función para determinar el resultado de un jugador
  const getPlayerResult = (player: ChessPlayer) => {
    if (player.result === "win") return "Victoria";
    if (
      player.result === "checkmated" ||
      player.result === "resigned" ||
      player.result === "timeout"
    )
      return "Derrota";

    return "Tablas";
  };

  // Función para mostrar el color del resultado
  const getResultBadgeColor = (result: string) => {
    if (result === "Victoria") return "bg-green-500";
    if (result === "Derrota") return "bg-red-500";

    return "bg-yellow-500";
  };

  // Función para mostrar el color del resultado
  // const getResultBadge = (result: string, player: "white" | "black") => {
  //   if (result === "1-0" && player === "white") return "bg-green-500";
  //   if (result === "0-1" && player === "black") return "bg-green-500";
  //   if ((result === "1-0" && player === "black") || (result === "0-1" && player === "white"))
  //     return "bg-red-500";

  //   return "bg-yellow-500";
  // };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-6 w-6" />
          Historial de Partidas de Ajedrez
        </CardTitle>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              className="pl-8"
              placeholder="Buscar por jugador, evento o apertura..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button className="gap-2" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          {/* <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="victories">Victorias</TabsTrigger>
            <TabsTrigger value="defeats">Derrotas</TabsTrigger>
            <TabsTrigger value="draws">Tablas</TabsTrigger>
          </TabsList> */}

          <TabsContent className="space-y-4" value="all">
            {filteredGames.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No se encontraron partidas</p>
            ) : (
              filteredGames.map((game) => (
                <Card key={game.url} className="overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-lg font-medium">Partida de {game.time_class}</h3>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDate(game.end_time)}
                          <Separator className="h-4" orientation="vertical" />
                          <Clock className="h-4 w-4" />
                          {formatTimeControl(game.time_control)}
                        </div>
                      </div>
                      <Badge className="self-start sm:self-center" variant="outline">
                        {getOpeningName(game.eco)}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white">
                          <div className="h-4 w-4 rounded-full border border-black" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{game.white.username}</span>
                            <span className="text-muted-foreground text-sm">
                              ({game.white.rating})
                            </span>
                          </div>
                          <Badge
                            className={`mt-1 ${getResultBadgeColor(getPlayerResult(game.white))}`}
                          >
                            {getPlayerResult(game.white)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-black">
                          <div className="h-4 w-4 rounded-full border border-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{game.black.username}</span>
                            <span className="text-muted-foreground text-sm">
                              ({game.black.rating})
                            </span>
                          </div>
                          <Badge
                            className={`mt-1 ${getResultBadgeColor(getPlayerResult(game.black))}`}
                          >
                            {getPlayerResult(game.black)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-muted-foreground text-sm">
                        {game.rated ? "Partida clasificatoria" : "Partida amistosa"}
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <a
                          className="flex items-center gap-1"
                          href={game.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Ver partida
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent className="space-y-4" value="victories">
            <p className="text-muted-foreground py-8 text-center">
              Filtro de victorias (implementar según necesidad)
            </p>
          </TabsContent>

          <TabsContent className="space-y-4" value="defeats">
            <p className="text-muted-foreground py-8 text-center">
              Filtro de derrotas (implementar según necesidad)
            </p>
          </TabsContent>

          <TabsContent className="space-y-4" value="draws">
            <p className="text-muted-foreground py-8 text-center">
              Filtro de tablas (implementar según necesidad)
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
