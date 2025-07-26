// ToDo:
// --------
// - Check / Checkmate
// --------

export class ChessGame {

    board: string[][]
    canMove: string[][]
    selectedPiece: number[]|undefined[]
    lastMove: [string,number|undefined,number|undefined,number|undefined,number|undefined]

    whiteKingHasMoved: boolean
    blackKingHasMoved: boolean
    whiteHasCastled: boolean
    blackHasCastled: boolean

    constructor (chessboard?:string[][], whiteKingHasCastled?:boolean, blackKingHasCastled?:boolean, whiteHasCastled?:boolean, blackHasCastled?: boolean) {

      this.board = chessboard || [
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
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
        ["","","","","","","","",],
      ]

      this.selectedPiece = [undefined,undefined]
      this.lastMove = ["",undefined,undefined,undefined,undefined]

      this.whiteKingHasMoved = whiteKingHasCastled || false
      this.blackKingHasMoved = blackKingHasCastled || false
      this.whiteHasCastled = whiteHasCastled || false
      this.blackHasCastled = blackHasCastled || false
    }
    
    selectPiece(rowIndex:number, colIndex:number, currentPlayer:string) {

      // If you click on a piece of the current player
      if (this.board[rowIndex][colIndex].includes(currentPlayer)) {

        // store coordinates of selected piece
        this.selectedPiece = [rowIndex,colIndex]
        
        // Reset canMove array
        this.canMove = [
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
          ["","","","","","","","",],
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
            // this.canMove[rowIndex+pawnMovement[0]][colIndex] = true
            this.canMove[rowIndex+pawnMovement[0]][colIndex] = "move"
          }

          // If not at the left side of the board
          if (colIndex !== 0) {
            // Can move diagonal diagonal-right if enemy piece there
            if (this.board[rowIndex+pawnMovement[0]][colIndex-1].includes(enemyPiece)){
              // this.canMove[rowIndex+pawnMovement[0]][colIndex-1] = true
              this.canMove[rowIndex+pawnMovement[0]][colIndex-1] = "move"
            }
          }
          // If not at the right side of the board
          if (colIndex !== 7) {
            // Can move diagonal diagonal-left if enemy piece there
            if (this.board[rowIndex+pawnMovement[0]][colIndex+1].includes(enemyPiece)){
              // this.canMove[rowIndex+pawnMovement[0]][colIndex+1] = true
              this.canMove[rowIndex+pawnMovement[0]][colIndex+1] = "move"
            }
          }
          // Can move two forward if starting position
          if ((currentPlayer === "w" && rowIndex === 6) || (currentPlayer === "b" && rowIndex === 1)) {

            if (this.board[rowIndex+pawnMovement[0]][colIndex] === "" && this.board[rowIndex+pawnMovement[1]][colIndex] === "") {
              // this.canMove[rowIndex+pawnMovement[1]][colIndex] = true
              this.canMove[rowIndex+pawnMovement[1]][colIndex] = "move"
            }
          }
          // En Pasant  
          if (
              currentPlayer === "w" && // currentPlayer is white
              rowIndex === 3 && // white Pawn is on the 5 rank
              this.lastMove[0] === "bP" && // last moved enemy piece is a Pawn
              this.lastMove[1] === 1 // enemy piece moved from 7 rank
            ) {

            if(this.lastMove[2] === colIndex+1){
              this.canMove[rowIndex+pawnMovement[0]][colIndex+1] = "en passant"
            }
            if(this.lastMove[2] === colIndex-1){
              this.canMove[rowIndex+pawnMovement[0]][colIndex-1] = "en passant"
            }
          }
          if (
              currentPlayer === "b" && // currentPlayer is black
              rowIndex === 4 && // black Pawn is on the 3 rank
              this.lastMove[0] === "wP" && // last moved enemy piece is a Pawn
              this.lastMove[1] === 6 // enemy piece moved from 7 rank
            ) {

            if(this.lastMove[2] === colIndex+1){
              this.canMove[rowIndex+pawnMovement[0]][colIndex+1] = "en passant"
            }
            if(this.lastMove[2] === colIndex-1){
              this.canMove[rowIndex+pawnMovement[0]][colIndex-1] = "en passant"
            }
          }
        }
        
        if (piece.includes("N")) {

          const knightMoves = [
            [2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2],
          ]

          for (let i=0; i<knightMoves.length;i++){

            if ( rowIndex+knightMoves[i][0] >= 0 && 
                 rowIndex+knightMoves[i][0] <= 7 &&
                 colIndex+knightMoves[i][1] >= 0 &&
                 colIndex+knightMoves[i][1] <= 7 ) {

              if (this.board[rowIndex+knightMoves[i][0]][colIndex+knightMoves[i][1]].includes(enemyPiece) || 
                  this.board[rowIndex+knightMoves[i][0]][colIndex+knightMoves[i][1]] === "") {
                // this.canMove[rowIndex+knightMoves[i][0]][colIndex+knightMoves[i][1]] = true
                this.canMove[rowIndex+knightMoves[i][0]][colIndex+knightMoves[i][1]] = "move"
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
                    // this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = true
                    this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = "move"
                  } else if (this.board[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j].includes(enemyPiece)) {
                    // this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = true
                    this.canMove[rowIndex+pieceMoves[i][0]*j][colIndex+pieceMoves[i][1]*j] = "move"
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

            const row = rowIndex+kingMoves[i][0]
            const col = colIndex+kingMoves[i][1]

            if ( row >= 0 && row <= 7 && col >= 0 && col <= 7 ) {

              const ummm = currentPlayer === "w" ? 7 : 0

              // Go to empty field or take enemy piece
              if (this.board[row][col] === "" || this.board[row][col].includes(enemyPiece)) {
                this.canMove[row][col] = "move"
              }  
              
              // Castling
              if ((currentPlayer === "w" && this.whiteHasCastled !== true && this.whiteKingHasMoved !== true) || (currentPlayer === "b" && this.blackHasCastled !== true && this.blackKingHasMoved !== true)) {
                
                // Long castling
                if (this.board[ummm][4] === currentPlayer+"K" && this.board[ummm][0] === currentPlayer+"R" && this.board[ummm][1] === "" && this.board[ummm][2] === "" && this.board[ummm][3] === "") {
                  this.canMove[ummm][1] = "castling"
                }

                // short castling
                if (this.board[ummm][4] === currentPlayer+"K" && this.board[ummm][7] === currentPlayer+"R" && this.board[ummm][5] === "" && this.board[ummm][6] === "") {
                  this.canMove[ummm][6] = "castling"
                }

              }
            }
          }
        }
        return true
      }
      return false
    }

    movePiece(rowIndex:number, colIndex:number, currentPlayer:string, promotion?:boolean, promotedPiece?:string) {

      if (this.canMove[rowIndex][colIndex] === "move") {

        if (!promotion) {

          if (this.selectedPiece[0] !== undefined && this.selectedPiece[1] !== undefined) {

            if (((rowIndex === 0 && currentPlayer === "w") || (rowIndex === 7 && currentPlayer === "b")) && this.board[this.selectedPiece[0]][this.selectedPiece[1]].includes("P")){
              
              if(currentPlayer === "w") {
                return ["promotion","w"]
              } else {
                return ["promotion","b"]
              }
              
            }
          }
        }

        if (this.selectedPiece[0] !== undefined && this.selectedPiece[1] !== undefined) {
          
          this.lastMove = [this.board[this.selectedPiece[0]][this.selectedPiece[1]],this.selectedPiece[0],this.selectedPiece[1],rowIndex,colIndex]

          const piece = promotedPiece || this.board[this.selectedPiece[0]][this.selectedPiece[1]]

          if (piece.includes("K") && currentPlayer === "w"){
            this.whiteKingHasMoved = true
          } else if (piece.includes("K") && currentPlayer === "b") {
            this.blackKingHasMoved = true
          }

          this.board[this.selectedPiece[0]][this.selectedPiece[1]] = ""
          this.board[rowIndex][colIndex] = piece
          this.selectedPiece = [undefined,undefined]
          this.canMove = [
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
          ]
          return ["success"]
        }
        return ["failed"]
      } 

      if (this.canMove[rowIndex][colIndex] === "castling") {

        const backlineOfCurrentPlayerKing = currentPlayer === "w" ? 7 : 0

        if((rowIndex === backlineOfCurrentPlayerKing && colIndex === 6) || (rowIndex === backlineOfCurrentPlayerKing && colIndex === 1)){
          this.board[rowIndex][colIndex] = currentPlayer+"K"
          if (colIndex === 6) {
            this.board[backlineOfCurrentPlayerKing][5] = currentPlayer+"R"
            this.board[backlineOfCurrentPlayerKing][7] = ""
            this.board[backlineOfCurrentPlayerKing][4] = ""
          } else if (colIndex === 1) {
            this.board[backlineOfCurrentPlayerKing][2] = currentPlayer+"R"
            this.board[backlineOfCurrentPlayerKing][0] = ""
            this.board[backlineOfCurrentPlayerKing][4] = ""
          }
          
          this.selectedPiece = [undefined,undefined]
          this.canMove = [
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
          ]
          if (currentPlayer === "w") {
            this.whiteHasCastled = true
            this.whiteKingHasMoved = true
          }
          if (currentPlayer === "b") {
            this.blackHasCastled = true
            this.blackKingHasMoved = true
          }
          
          return ["success"]
        }

      }

      if (this.canMove[rowIndex][colIndex] === "en passant") {
        
        if (this.selectedPiece[0] !== undefined && this.selectedPiece[1] !== undefined) {

          const derp = currentPlayer === "w" ? 1 : -1

          this.board[this.selectedPiece[0]][this.selectedPiece[1]] = ""
          this.board[rowIndex+derp][colIndex] = ""
          this.board[rowIndex][colIndex] = currentPlayer+"P"
          this.selectedPiece = [undefined,undefined]
          this.canMove = [
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
            ["","","","","","","","",],
          ]
          return ["success"]
        }
      }
      return ["failed"]
    }
  }