import type { Move } from "../utils/chessTypes"
import { Button } from "@/components/ui/button"

interface MoveHistoryProps {
  moves: Move[]
  currentMoveIndex: number
  goToMove: (index: number) => void
}

export default function MoveHistory({ moves, currentMoveIndex, goToMove }: MoveHistoryProps) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Move History</h2>
      <div className="mb-4">
        <Button onClick={() => goToMove(-1)} disabled={currentMoveIndex === -1} className="mr-2">
          Start
        </Button>
        <Button onClick={() => goToMove(moves.length - 1)} disabled={currentMoveIndex === moves.length - 1}>
          Latest
        </Button>
      </div>
      <div className="h-96 overflow-y-auto">
        {moves.map((move, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${index === currentMoveIndex ? "bg-blue-100" : ""}`}
            onClick={() => goToMove(index)}
          >
            {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ""}
            {move.piece.color === "white" ? "◯" : "●"} {move.piece.type} {String.fromCharCode(97 + move.from.col)}
            {8 - move.from.row} → {String.fromCharCode(97 + move.to.col)}
            {8 - move.to.row}
          </div>
        ))}
      </div>
    </div>
  )
}

