import type { ChessPiece, Position } from "./chessTypes"

export function initializeBoard(): ChessPiece[][] {
  const board: ChessPiece[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: "pawn", color: "black" }
    board[6][i] = { type: "pawn", color: "white" }
  }

  // Set up other pieces
  const setupRow = (row: number, color: "white" | "black") => {
    board[row][0] = { type: "rook", color }
    board[row][1] = { type: "knight", color }
    board[row][2] = { type: "bishop", color }
    board[row][3] = { type: "queen", color }
    board[row][4] = { type: "king", color }
    board[row][5] = { type: "bishop", color }
    board[row][6] = { type: "knight", color }
    board[row][7] = { type: "rook", color }
  }

  setupRow(0, "black")
  setupRow(7, "white")

  return board
}

export function isValidMove(board: ChessPiece[][], from: Position, to: Position, currentPlayer: string): boolean {
  const piece = board[from.row][from.col]
  if (!piece || piece.color !== currentPlayer) return false

  // Implement move validation logic for each piece type
  switch (piece.type) {
    case "pawn":
      return isValidPawnMove(board, from, to, currentPlayer)
    case "rook":
      return isValidRookMove(board, from, to)
    case "knight":
      return isValidKnightMove(from, to)
    case "bishop":
      return isValidBishopMove(board, from, to)
    case "queen":
      return isValidQueenMove(board, from, to)
    case "king":
      return isValidKingMove(board, from, to)
    default:
      return false
  }
}

function isValidPawnMove(board: ChessPiece[][], from: Position, to: Position, currentPlayer: string): boolean {
  const direction = currentPlayer === "white" ? -1 : 1
  const startRow = currentPlayer === "white" ? 6 : 1

  // Move forward
  if (from.col === to.col && !board[to.row][to.col]) {
    if (to.row === from.row + direction) return true
    if (from.row === startRow && to.row === from.row + 2 * direction && !board[from.row + direction][from.col])
      return true
  }

  // Capture diagonally
  if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction) {
    if (board[to.row][to.col] && board[to.row][to.col].color !== currentPlayer) return true
  }

  return false
}

function isValidRookMove(board: ChessPiece[][], from: Position, to: Position): boolean {
  if (from.row !== to.row && from.col !== to.col) return false

  const rowDir = Math.sign(to.row - from.row)
  const colDir = Math.sign(to.col - from.col)

  let row = from.row + rowDir
  let col = from.col + colDir

  while (row !== to.row || col !== to.col) {
    if (board[row][col]) return false
    row += rowDir
    col += colDir
  }

  return true
}

function isValidKnightMove(from: Position, to: Position): boolean {
  const rowDiff = Math.abs(from.row - to.row)
  const colDiff = Math.abs(from.col - to.col)
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
}

function isValidBishopMove(board: ChessPiece[][], from: Position, to: Position): boolean {
  if (Math.abs(from.row - to.row) !== Math.abs(from.col - to.col)) return false

  const rowDir = Math.sign(to.row - from.row)
  const colDir = Math.sign(to.col - from.col)

  let row = from.row + rowDir
  let col = from.col + colDir

  while (row !== to.row && col !== to.col) {
    if (board[row][col]) return false
    row += rowDir
    col += colDir
  }

  return true
}

function isValidQueenMove(board: ChessPiece[][], from: Position, to: Position): boolean {
  return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to)
}

function isValidKingMove(board: ChessPiece[][], from: Position, to: Position): boolean {
  const rowDiff = Math.abs(from.row - to.row)
  const colDiff = Math.abs(from.col - to.col)
  return rowDiff <= 1 && colDiff <= 1
}

export function movePiece(board: ChessPiece[][], from: Position, to: Position): ChessPiece[][] {
  const newBoard = board.map((row) => [...row])
  newBoard[to.row][to.col] = newBoard[from.row][from.col]
  newBoard[from.row][from.col] = null
  return newBoard
}

export function isCheck(board: ChessPiece[][], currentPlayer: string): boolean {
  const oppositeColor = currentPlayer === "white" ? "black" : "white"
  const kingPosition = findKing(board, currentPlayer)

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === oppositeColor) {
        if (isValidMove(board, { row, col }, kingPosition, oppositeColor)) {
          return true
        }
      }
    }
  }

  return false
}

export function isCheckmate(board: ChessPiece[][], currentPlayer: string): boolean {
  if (!isCheck(board, currentPlayer)) return false

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, { row, col }, { row: toRow, col: toCol }, currentPlayer)) {
              const newBoard = movePiece(board, { row, col }, { row: toRow, col: toCol })
              if (!isCheck(newBoard, currentPlayer)) {
                return false
              }
            }
          }
        }
      }
    }
  }

  return true
}

function findKing(board: ChessPiece[][], color: string): Position {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.type === "king" && piece.color === color) {
        return { row, col }
      }
    }
  }
  throw new Error(`King not found for ${color}`)
}

