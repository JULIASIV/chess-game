"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./components/ChessBoard"
import MoveHistory from "./components/MoveHistory"
import GameList from "./components/GameList"
import { initializeBoard, movePiece, isValidMove, isCheck, isCheckmate } from "./utils/chessLogic"
import type { ChessPiece, Move, Game } from "./utils/chessTypes"

export default function ChessGame() {
  const [board, setBoard] = useState(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState("white")
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [gameStatus, setGameStatus] = useState("Playing")
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [games, setGames] = useState<Game[]>([])
  const [currentGameId, setCurrentGameId] = useState<string | null>(null)

  useEffect(() => {
    loadGames()
  }, [])

  useEffect(() => {
    if (isCheck(board, currentPlayer)) {
      if (isCheckmate(board, currentPlayer)) {
        setGameStatus(`Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`)
        saveGame()
      } else {
        setGameStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`)
      }
    } else {
      setGameStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`)
    }
  }, [board, currentPlayer])

  const handleSquareClick = (row: number, col: number) => {
    if (currentMoveIndex !== moveHistory.length - 1) return // Prevent moves when reviewing history

    if (selectedPiece) {
      if (isValidMove(board, selectedPiece, { row, col }, currentPlayer)) {
        const newBoard = movePiece(board, selectedPiece, { row, col })
        setBoard(newBoard)
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
        setSelectedPiece(null)

        // Record the move
        const move: Move = {
          piece: board[selectedPiece.row][selectedPiece.col] as ChessPiece,
          from: selectedPiece,
          to: { row, col },
        }
        const newMoveHistory = [...moveHistory, move]
        setMoveHistory(newMoveHistory)
        setCurrentMoveIndex(newMoveHistory.length - 1)

        // Save the game after each move
        saveGame(newMoveHistory)
      } else {
        setSelectedPiece(null)
      }
    } else {
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col })
      }
    }
  }

  const goToMove = (index: number) => {
    if (index < -1 || index >= moveHistory.length) return

    if (index === -1) {
      setBoard(initializeBoard())
      setCurrentPlayer("white")
    } else {
      const newBoard = initializeBoard()
      for (let i = 0; i <= index; i++) {
        const move = moveHistory[i]
        newBoard[move.to.row][move.to.col] = move.piece
        newBoard[move.from.row][move.from.col] = null
      }
      setBoard(newBoard)
      setCurrentPlayer(index % 2 === 0 ? "black" : "white")
    }
    setCurrentMoveIndex(index)
  }

  const saveGame = (moves = moveHistory) => {
    const gameId = currentGameId || Date.now().toString()
    const game: Game = {
      id: gameId,
      date: new Date().toISOString(),
      moves: moves,
    }

    const updatedGames = games.filter((g) => g.id !== gameId).concat(game)
    setGames(updatedGames)
    setCurrentGameId(gameId)

    localStorage.setItem("chessGames", JSON.stringify(updatedGames))
  }

  const loadGames = () => {
    const savedGames = localStorage.getItem("chessGames")
    if (savedGames) {
      setGames(JSON.parse(savedGames))
    }
  }

  const startNewGame = () => {
    setBoard(initializeBoard())
    setCurrentPlayer("white")
    setSelectedPiece(null)
    setGameStatus("Playing")
    setMoveHistory([])
    setCurrentMoveIndex(-1)
    setCurrentGameId(null)
  }

  const loadGame = (gameId: string) => {
    const game = games.find((g) => g.id === gameId)
    if (game) {
      setMoveHistory(game.moves)
      goToMove(game.moves.length - 1)
      setCurrentGameId(gameId)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Chess Game</h1>
      <div className="mb-4 text-xl font-semibold text-white">{gameStatus}</div>
      <div className="flex flex-col md:flex-row gap-8">
        <ChessBoard board={board} onSquareClick={handleSquareClick} selectedPiece={selectedPiece} />
        <div className="flex flex-col gap-4">
          <MoveHistory moves={moveHistory} currentMoveIndex={currentMoveIndex} goToMove={goToMove} />
          <GameList games={games} loadGame={loadGame} startNewGame={startNewGame} currentGameId={currentGameId} />
        </div>
      </div>
    </div>
  )
}

