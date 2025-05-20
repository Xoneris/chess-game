import { useRef, useState } from "react"


export default function App() {
  
  class ChessGame {

    board: string[][]
    canMove: boolean[][]
    selectedPiece: number[]|undefined[]

    constructor () {

      this.board = [
        ["bR","bN","bB","bQ","bK","bB","bN","bR",],
        ["bP","bP","bP","bP","bP","bP","bP","bP",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["wP","wP","wP","wP","wP","wP","wP","wP",],
        ["wR","wN","wB","wQ","wK","wB","wN","wR",],
      ]

      this.canMove = [
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
        [false,false,false,false,false,false,false,false,],
      ]

      this.selectedPiece = [undefined,undefined]
    }
    
    selectPiece(rowIndex:number, colIndex:number, currentPlayer:string) {

      if (this.board[rowIndex][colIndex].includes(currentPlayer)) {

        // store coordinates of selected piece
        this.selectedPiece = [rowIndex,colIndex]
        
        // Reset canMove array
        this.canMove = [
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
          [false,false,false,false,false,false,false,false,],
        ]

        const enemyPiece = currentPlayer === "w" ? "b" : "w"
        const piece = this.board[rowIndex][colIndex]

        if (piece.includes("P")) {
          
          let pawnMovement = []
          if(currentPlayer === "w") {
            pawnMovement = [-1,-2]
          } else {
            pawnMovement = [1,2]
          }

          // Can move forward if nothing in front
          if (this.board[rowIndex+pawnMovement[0]][colIndex] === ""){
            this.canMove[rowIndex+pawnMovement[0]][colIndex] = true
          }
          if (colIndex - 1 > 0 && colIndex + 1 < 7) {

            // Can move diagonal up-right if piece there
            if (this.board[rowIndex+pawnMovement[0]][colIndex-1].includes(enemyPiece)){
              this.canMove[rowIndex+pawnMovement[0]][colIndex-1] = true
            }
            // Can move diagonal up-left if piece there
            if (this.board[rowIndex+pawnMovement[0]][colIndex+1].includes(enemyPiece)){
              this.canMove[rowIndex+pawnMovement[0]][colIndex+1] = true
            }
          }
          // Can move two forward if starting position
          if ((currentPlayer === "w" && rowIndex === 6) || (currentPlayer === "b" && rowIndex === 1)) {

            if (this.board[rowIndex+pawnMovement[0]][colIndex] === "" && this.board[rowIndex+pawnMovement[1]][colIndex] === "") {
              this.canMove[rowIndex+pawnMovement[1]][colIndex] = true
            }
          }
          // En Pasant  
          // Promotion
        }
        
        if (piece.includes("N")) {

          const KnightMoves = [
            [2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2],
          ]

          for (let i=0; i<KnightMoves.length;i++){

            if ( rowIndex+KnightMoves[i][0] >= 0 && 
                 rowIndex+KnightMoves[i][0] <= 7 &&
                 colIndex+KnightMoves[i][1] >= 0 &&
                 colIndex+KnightMoves[i][1] <= 7 ) {

              if (this.board[rowIndex+KnightMoves[i][0]][colIndex+KnightMoves[i][1]].includes(enemyPiece) || 
                  this.board[rowIndex+KnightMoves[i][0]][colIndex+KnightMoves[i][1]] === "") {
                this.canMove[rowIndex+KnightMoves[i][0]][colIndex+KnightMoves[i][1]] = true
              }
            }

          }

        }

        if (piece.includes("B") || piece.includes("R") || piece.includes("Q")) {

          let pieceMoves:number[][] = []

          if (piece.includes("B")){
            pieceMoves = [
              [1,1],[1,-1],[-1,1],[-1,-1]
            ]
          } else if (piece.includes("R")){
            pieceMoves = [
              [1,0],[-1,0],[0,1],[0,-1]
            ]
          } else if (piece.includes("Q")){
            pieceMoves = [
              [1,1],[1,-1],[-1,1],[-1,-1],
              [1,0],[-1,0],[0,1],[0,-1]
            ]
          }

          for (let i=0; i<pieceMoves.length;i++){

            for (let j=1; j<8 ;j++){
              
              if ( rowIndex+pieceMoves[i][0]*j >= 0 && 
                rowIndex+pieceMoves[i][0]*j <= 7 &&
                colIndex+pieceMoves[i][1]*j >= 0 &&
                colIndex+pieceMoves[i][1]*j <= 7 ) {

                  if (this.board[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] === "") {
                    this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = true
                  } else if (this.board[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j].includes(enemyPiece)) {
                    this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = true
                    break
                  } else {
                    break
                  }
                }
              }

          }

        }

        if (piece.includes("K")) {

          const kingMoves = [
            [1,1],[1,-1],[-1,1],[-1,-1],
            [1,0],[-1,0],[0,1],[0,-1]
          ]

          for (let i=0; i<kingMoves.length;i++) {

              if ( rowIndex+kingMoves[i][0] >= 0 && 
                rowIndex+kingMoves[i][0] <= 7 &&
                colIndex+kingMoves[i][1] >= 0 &&
                colIndex+kingMoves[i][1] <= 7 ) {

                  if (this.board[rowIndex+kingMoves[i][0]][colIndex+kingMoves[i][1]] === "") {
                    this.canMove[rowIndex+kingMoves[i][0]][colIndex+kingMoves[i][1]] = true
                  } else if (this.board[rowIndex+kingMoves[i][0]][colIndex+kingMoves[i][1]].includes(enemyPiece)) {
                    this.canMove[rowIndex+kingMoves[i][0]][colIndex+kingMoves[i][1]] = true
                  } 
                
              }

          }
        }

        return true
      }
      
      return false
      

    }

    movePiece(rowIndex:number, colIndex:number, currentPlayer:string) {

      if (this.canMove[rowIndex][colIndex] === true) {

        
        if (this.selectedPiece[0] !== undefined && this.selectedPiece[1] !== undefined) {
          
          const piece = this.board[this.selectedPiece[0]][this.selectedPiece[1]]      
          this.board[this.selectedPiece[0]][this.selectedPiece[1]] = ""
          this.board[rowIndex][colIndex] = piece
          this.selectedPiece = [undefined,undefined]
          this.canMove = [
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
            [false,false,false,false,false,false,false,false,],
          ]
          return true
        }
      } else {
        return false
      }
    }
  }

  // const [chessGame, setChessGame] = useState(new ChessGame)
  const chessGame = useRef(new ChessGame)

  // const [chessBoard, setChessBoard] = useState(chessGame.board)
  const [isPieceSelected, setIsPieceSelected] = useState({value: false})
  const [currentPlayer, setCurrentPlayer] = useState("w")

  const handleClick = (rowIndex:number, colIndex:number) => {

    if (isPieceSelected) {

      if(chessGame.current.board[rowIndex][colIndex].includes(currentPlayer)) {
        // If you have a piece selected and you click of another one of your pieces
        const select = chessGame.current.selectPiece(rowIndex,colIndex, currentPlayer)
        if (select) {
          setIsPieceSelected({...isPieceSelected, value: true})
        }

      } else {
        // Move Piece
        const move = chessGame.current.movePiece(rowIndex, colIndex, currentPlayer)
        if (move) {
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

  return (
    <main>
      {
        chessGame.current.board.map((row,rowIndex) => (
          <div className="flex">
          {
            row.map((field,colIndex) => (
            
              <div 
                className={
                  `w-8 h-8 border flex justify-center items-center 
                  ${chessGame.current.selectedPiece[0] === rowIndex && chessGame.current.selectedPiece[1] === colIndex ? "bg-yellow-600" : null}
                  ${chessGame.current.canMove[rowIndex][colIndex] === true 
                    ? chessGame.current.board[rowIndex][colIndex].includes(currentPlayer === "w" ? "b" : "w")
                      ? "bg-red-600"
                      : "bg-green-600"
                    : null
                  }
                `}
                onClick={() => handleClick(rowIndex, colIndex)}
                // onClick={() => alert(rowIndex + "," + colIndex)}
              >
                {field}
              </div>
            ))
          }
          </div>
        ))
      }
      <p>
        Current Player: {currentPlayer}
      </p>
    </main>
  )
}
