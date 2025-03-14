"use client";

import {useState, useEffect} from "react";
import {Chess} from "chess.js";
import {Chessboard} from "react-chessboard";
import {ArrowLeft, ArrowRight, Upload, Download, RotateCcw, AlertCircle} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export function ChessBoardClient({pgnProp = ""}: {pgnProp?: string}) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pgn, setPgn] = useState(pgnProp);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left arrow key for previous move
      if (e.key === "ArrowLeft" && currentMoveIndex > -1) {
        navigateMove(currentMoveIndex - 1);
      }
      // Right arrow key for next move
      else if (e.key === "ArrowRight" && currentMoveIndex < moveHistory.length - 1) {
        navigateMove(currentMoveIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentMoveIndex, moveHistory]); // Re-add event listener when these dependencies change

  // Function to make a move on the board
  function makeMove(move: any) {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setMoveHistory([...moveHistory, result.san]);
        setCurrentMoveIndex(currentMoveIndex + 1);
        setError(null);

        // Simple analysis based on piece count
        analyzePosition(gameCopy);
      }

      return result;
    } catch (e) {
      return null;
    }
  }

  // Function to handle piece drop for drag and drop moves
  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen for simplicity
    });

    return move !== null;
  }

  // Function to load a PGN
  function loadPGN() {
    try {
      const gameCopy = new Chess();

      gameCopy.loadPgn(pgn);
      setGame(gameCopy);
      setFen(gameCopy.fen());

      // Extract move history from PGN
      const history = gameCopy.history();

      setMoveHistory(history);
      setCurrentMoveIndex(history.length - 1);
      setError(null);

      // Analyze the final position
      analyzePosition(gameCopy);
    } catch (e) {
      setError("Invalid PGN format. Please check and try again.");
    }
  }

  // Function to reset the board
  function resetBoard() {
    const newGame = new Chess();

    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setAnalysis("");
    setError(null);
  }

  // Function to navigate through move history
  function navigateMove(index: number) {
    if (index >= -1 && index < moveHistory.length) {
      const gameCopy = new Chess();

      // Replay all moves up to the selected index
      for (let i = 0; i <= index; i++) {
        gameCopy.move(moveHistory[i]);
      }

      setGame(gameCopy);
      setFen(gameCopy.fen());
      setCurrentMoveIndex(index);

      // Analyze the current position
      analyzePosition(gameCopy);
    }
  }

  // Function to analyze the current position
  function analyzePosition(currentGame: Chess) {
    // Count material
    const fen = currentGame.fen();
    const pieces = fen.split(" ")[0];

    let whiteMaterial = 0;
    let blackMaterial = 0;

    for (const char of pieces) {
      if (char === "P") whiteMaterial += 1;
      if (char === "N" || char === "B") whiteMaterial += 3;
      if (char === "R") whiteMaterial += 5;
      if (char === "Q") whiteMaterial += 9;

      if (char === "p") blackMaterial += 1;
      if (char === "n" || char === "b") blackMaterial += 3;
      if (char === "r") blackMaterial += 5;
      if (char === "q") blackMaterial += 9;
    }

    // Generate analysis text
    let analysisText = "";

    // Material difference
    const materialDiff = whiteMaterial - blackMaterial;

    if (materialDiff > 0) {
      analysisText += `White is ahead in material by ${materialDiff} points.\n`;
    } else if (materialDiff < 0) {
      analysisText += `Black is ahead in material by ${Math.abs(materialDiff)} points.\n`;
    } else {
      analysisText += "Material is equal.\n";
    }

    // Game state
    if (currentGame.isCheckmate()) {
      analysisText += "Checkmate! Game over.\n";
    } else if (currentGame.isDraw()) {
      analysisText += "The game is a draw.\n";
    } else if (currentGame.isStalemate()) {
      analysisText += "Stalemate! The game is a draw.\n";
    } else if (currentGame.isCheck()) {
      analysisText += `${currentGame.turn() === "w" ? "White" : "Black"} is in check.\n`;
    }

    // Turn
    analysisText += `It's ${currentGame.turn() === "w" ? "White" : "Black"}'s turn to move.\n`;

    // Move count
    analysisText += `Move number: ${Math.floor(currentGame.moveNumber() / 2) + 1}\n`;

    setAnalysis(analysisText);
  }

  // Function to export current game as PGN
  function exportPGN() {
    return game.pgn();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="mb-6 text-center text-3xl font-bold">Chess Game Analyzer</h1> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chess Board</CardTitle>
              <CardDescription>
                Make moves by dragging pieces or navigate through game history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mx-auto w-full max-w-[600px]">
                <Chessboard
                  areArrowsAllowed
                  boardWidth={600}
                  customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  position={fen}
                  onPieceDrop={onDrop}
                />
              </div>

              <div className="mt-4 flex justify-center space-x-2">
                <Button
                  disabled={currentMoveIndex === -1}
                  variant="outline"
                  onClick={() => navigateMove(-1)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start
                </Button>
                <Button
                  disabled={currentMoveIndex <= -1}
                  variant="outline"
                  onClick={() => navigateMove(currentMoveIndex - 1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  disabled={currentMoveIndex >= moveHistory.length - 1}
                  variant="outline"
                  onClick={() => navigateMove(currentMoveIndex + 1)}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Next
                </Button>
                <Button variant="outline" onClick={resetBoard}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis and Controls */}
        <div>
          <Tabs defaultValue="analysis">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="moves">Moves</TabsTrigger>
              <TabsTrigger value="pgn">PGN</TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Position Analysis</CardTitle>
                  <CardDescription>Evaluation of the current board position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted min-h-[200px] whitespace-pre-line rounded-md p-4">
                    {analysis || "Make a move to see analysis"}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moves Tab */}
            <TabsContent value="moves">
              <Card>
                <CardHeader>
                  <CardTitle>Move History</CardTitle>
                  <CardDescription>Click on a move to jump to that position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted max-h-[400px] min-h-[200px] overflow-y-auto rounded-md p-4">
                    {moveHistory.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {moveHistory.map((move, index) => (
                          <Button
                            key={index}
                            className="justify-start"
                            variant={index === currentMoveIndex ? "default" : "ghost"}
                            onClick={() => navigateMove(index)}
                          >
                            {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."} {move}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No moves yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PGN Tab */}
            <TabsContent value="pgn">
              <Card>
                <CardHeader>
                  <CardTitle>PGN Import/Export</CardTitle>
                  <CardDescription>Load a game from PGN or export the current game</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="Paste PGN here..."
                      value={pgn}
                      onChange={(e) => setPgn(e.target.value)}
                    />

                    {error && (
                      <div className="bg-destructive/10 text-destructive flex items-center rounded-md p-2">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        {error}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={loadPGN}>
                        <Upload className="mr-2 h-4 w-4" />
                        Load PGN
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          const exportedPgn = exportPGN();

                          setPgn(exportedPgn);
                          // Show success message
                          setError(null);
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PGN
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
