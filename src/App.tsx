import { useRef, useState } from "react"
import { ChessGame } from "./ChessGame"

export default function App() {
  
  const baseBoard = [
        ["bR","bN","bB","bQ","bK","bB","bN","bR",],
        ["bP","bP","bP","bP","bP","bP","bP","bP",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["wP","wP","wP","wP","wP","wP","wP","wP",],
        ["wR","wN","wB","wQ","wK","wB","wN","wR",],
      ]

  const chessGame = useRef(new ChessGame())
  const [isPieceSelected, setIsPieceSelected] = useState({value: false})
  const [currentPlayer, setCurrentPlayer] = useState("w")
  const [promotion, setPromotion] = useState<[string,number,number]>(["",0,0])

  const [hoverField, setHoverField] = useState<[number|undefined,number|undefined,string]>([undefined,undefined,""])

  const handleClick = (rowIndex:number, colIndex:number) => {

    if (isPieceSelected.value) {

      if(chessGame.current.board[rowIndex][colIndex].includes(currentPlayer)) {
        // If you have a piece selected and you click on another one of your pieces
        const select = chessGame.current.selectPiece(rowIndex,colIndex, currentPlayer)
        if (select) {
          setIsPieceSelected({...isPieceSelected, value: true})
        }

      } else {
        // Move Piece
        const move = chessGame.current.movePiece(rowIndex, colIndex, currentPlayer)

        if (move[0] === "promotion"){
          setPromotion([move[1],rowIndex,colIndex])
        }

        if (move[0] === "success") {
          setIsPieceSelected({...isPieceSelected, value: false})
          setCurrentPlayer(currentPlayer === "w" ? "b" : "w")
        }
      }

    } else {
      // Select Piece
      // Show possible moves of piece
      const select = chessGame.current.selectPiece(rowIndex, colIndex, currentPlayer)
      if (select) {
        setIsPieceSelected({...isPieceSelected, value: true})
      }
    }

  }

  const handlePromotion = (promotion:[string,number,number], chosenPieceToPromote:string) => {

    const [playerToPromote, rowIndex, colIndex] = promotion
    const pieceToPromote = currentPlayer+chosenPieceToPromote
    const move = chessGame.current.movePiece(rowIndex, colIndex, playerToPromote, true, pieceToPromote)

    console.log(move)

    if (move[0] === "success") {
      setIsPieceSelected({...isPieceSelected, value: false})
      setCurrentPlayer(currentPlayer === "w" ? "b" : "w")
      setPromotion(["",0,0])
    }

  }

  const chessFigure = (chessFigure:string) => {

    switch (chessFigure) {
      case "wP":
        return "pawn-w"
      case "wR":
        return "rook-w"
      case "wN":
        return "knight-w"
      case "wB":
        return "bishop-w"
      case "wQ":
        return "queen-w"
      case "wK":
        return "king-w"
      case "bP":
        return "pawn-b"
      case "bR":
        return "rook-b"
      case "bN":
        return "knight-b"
      case "bB":
        return "bishop-b"
      case "bQ":
        return "queen-b"
      case "bK":
        return "king-b"
      default:
        return ""
    }
  }

  const newGame = () => {
    chessGame.current = new ChessGame(baseBoard)
    setIsPieceSelected({...isPieceSelected, value: false})
    setCurrentPlayer("w")
    setPromotion(["",0,0])
  }

  const convertToChessFieldNotation = (rowIndex:number|undefined, colIndex:number|undefined) => {

    if (rowIndex !== undefined && colIndex !== undefined){
      
      let row = ""
      switch(rowIndex) {
        case 7:
          row = "A"
          break
        case 6:
          row = "B"
          break
        case 5:
          row = "C"
          break
        case 4:
          row = "D"
          break
        case 3:
          row = "E"
          break
        case 2:
          row = "F"
          break
        case 1:
          row = "G"
          break
        case 0:
          row = "H"
          break
      }

      const col = colIndex + 1

      return row + col
    }
  }

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center bg-gray-400">

      <nav className="bg-blue-950 w-full p-2 text-gray-300">
        
      </nav>

      <div className="w-full grow p-4 flex flex-col justify-center items-center">
      
        <button className="bg-white p-2 border mb-2 rounded-lg hover:cursor-pointer" onClick={() => newGame()}>
          New Game
        </button>

        {
          chessGame.current.board.map((row,rowIndex) => (
            <div className="flex" key={rowIndex} >
            {
              row.map((field,colIndex) => (
              
                <div
                  key={colIndex} 
                  className={
                    `w-16 h-16 border flex justify-center items-center transition-all
                    ${chessGame.current.selectedPiece[0] === rowIndex && chessGame.current.selectedPiece[1] === colIndex ? "bg-yellow-600" : null}
                    ${chessGame.current.canMove[rowIndex][colIndex] === "move" || chessGame.current.canMove[rowIndex][colIndex] === "castling" || chessGame.current.canMove[rowIndex][colIndex] === "en passant"
                      ? chessGame.current.board[rowIndex][colIndex].includes(currentPlayer === "w" ? "b" : "w")
                        ? "bg-red-600"
                        : "bg-green-600"
                      : (rowIndex + colIndex) % 2 !== 0
                        ? "bg-gray-700"
                        : "bg-white"
                    }
                  `}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  onMouseOver={() => setHoverField([rowIndex, colIndex, chessGame.current.board[rowIndex][colIndex]])}
                >
                  {
                    field !== ""
                    ? <img 
                      src={`/chess-figures/${chessFigure(field)}.svg`}
                      alt={chessFigure(field)}
                    />
                    : null
                  }
                  

                </div>
              ))
            }
            </div>
          ))
        }
        {
          promotion[0] !== ""
          ?<div className="flex gap-2 p-2">
            <p onClick={() => handlePromotion(promotion,"Q")}>{currentPlayer}Q</p>
            <p onClick={() => handlePromotion(promotion,"R")}>{currentPlayer}R</p>
            <p onClick={() => handlePromotion(promotion,"N")}>{currentPlayer}N</p>
            <p onClick={() => handlePromotion(promotion,"B")}>{currentPlayer}B</p>
          </div>
          : null
        }
        
        <div>
          <p>rowIndex: {hoverField[0]}</p>
          <p>colIndex: {hoverField[1]}</p>
          <p>Piece: {hoverField[2]}</p>
        </div>

        <div className="flex flex-col">
          <h4>Last Move: </h4>
          <p>Piece: {chessGame.current.lastMove[0]}</p>
          <p>From: {convertToChessFieldNotation(chessGame.current.lastMove[1],chessGame.current.lastMove[2])}</p>
          <p>To: {convertToChessFieldNotation(chessGame.current.lastMove[3],chessGame.current.lastMove[4])}</p>
        </div>

        <p>
          Current Player: {currentPlayer}
        </p>

        <p>
          White has castled: {chessGame.current.whiteHasCastled === true ? "yes" : "no"}
        </p>
        <p>
          Black has castled: {chessGame.current.blackHasCastled === true ? "yes" : "no"}
        </p>
        <p>
          White King has moved: {chessGame.current.whiteKingHasMoved === true ? "yes" : "no"}
        </p>
        <p>
          Black King has moved: {chessGame.current.blackKingHasMoved === true ? "yes" : "no"}
        </p>

      </div>

      <footer className="w-full p-2 bg-blue-900 flex justify-center items-center">
        
      </footer>


    </main>
  )
}
