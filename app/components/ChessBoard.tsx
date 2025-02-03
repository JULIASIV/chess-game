import type { ChessPiece } from "../utils/chessTypes"

interface ChessBoardProps {
  board: ChessPiece[][]
  onSquareClick: (row: number, col: number) => void
  selectedPiece: { row: number; col: number } | null
}

export default function ChessBoard({ board, onSquareClick, selectedPiece }: ChessBoardProps) {
  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-gray-800 shadow-lg rounded-lg overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex
          const squareColor = (rowIndex + colIndex) % 2 === 0 ? "bg-amber-200" : "bg-amber-800"
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center ${squareColor} ${isSelected ? "ring-4 ring-blue-500" : ""}`}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && <span className="text-5xl drop-shadow-md">{getPieceEmoji(piece)}</span>}
            </div>
          )
        }),
      )}
    </div>
  )
}

function getPieceEmoji(piece: ChessPiece): string {
  const pieceEmojis: { [key: string]: string } = {
    "white-pawn": "♙",
    "white-rook": "♖",
    "white-knight": "♘",
    "white-bishop": "♗",
    "white-queen": "♕",
    "white-king": "♔",
    "black-pawn": "♟",
    "black-rook": "♜",
    "black-knight": "♞",
    "black-bishop": "♝",
    "black-queen": "♛",
    "black-king": "♚",
  }
  return pieceEmojis[`${piece.color}-${piece.type}`]
}

