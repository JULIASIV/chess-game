import type { Game } from "../utils/chessTypes"
import { Button } from "@/components/ui/button"

interface GameListProps {
  games: Game[]
  loadGame: (gameId: string) => void
  startNewGame: () => void
  currentGameId: string | null
}

export default function GameList({ games, loadGame, startNewGame, currentGameId }: GameListProps) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Saved Games</h2>
      <Button onClick={startNewGame} className="w-full mb-4">
        Start New Game
      </Button>
      <div className="h-64 overflow-y-auto">
        {games.map((game) => (
          <div
            key={game.id}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${game.id === currentGameId ? "bg-blue-100" : ""}`}
            onClick={() => loadGame(game.id)}
          >
            {new Date(game.date).toLocaleString()} - {game.moves.length} moves
          </div>
        ))}
      </div>
    </div>
  )
}

