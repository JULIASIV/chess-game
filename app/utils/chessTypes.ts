export interface ChessPiece {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
  color: "white" | "black"
}

export interface Position {
  row: number
  col: number
}

export interface Move {
  piece: ChessPiece
  from: Position
  to: Position
}

export interface Game {
  id: string
  date: string
  moves: Move[]
}

