// ToDo:
// - En Pasant
// - King/Rook: Castling
// - Check / Checkmate

export class ChessGame {

    board: string[][]
    // canMove: boolean[][]
    canMove: string[][]
    selectedPiece: number[]|undefined[]

    constructor (chessboard?:string[][]) {

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

      // this.canMove = [
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      //   [false,false,false,false,false,false,false,false,],
      // ]
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
    }
    
    selectPiece(rowIndex:number, colIndex:number, currentPlayer:string) {

      if (this.board[rowIndex][colIndex].includes(currentPlayer)) {

        // store coordinates of selected piece
        this.selectedPiece = [rowIndex,colIndex]
        
        // Reset canMove array
        // this.canMove = [
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        //   [false,false,false,false,false,false,false,false,],
        // ]
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

              // Go to empty field or take enemy piece
              if (this.board[row][col] === "" || this.board[row][col].includes(enemyPiece)) {
                // this.canMove[row][col] = true
                this.canMove[row][col] = "move"
              }  
              
              // Long castling
              if (this.board[7][4] === "wK" && this.board[7][0] === "wR" && this.board[7][1] === "" && this.board[7][2] === "" && this.board[7][3] === "") {
                // this.canMove[7][1] = true
                this.canMove[7][1] = "castling"
              }

              // short castling
              if (this.board[7][4] === "wK" && this.board[7][7] === "wR" && this.board[7][5] === "" && this.board[7][6] === "") {
                // this.canMove[7][6] = true
                this.canMove[7][6] = "castling"
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
          
          const piece = promotedPiece || this.board[this.selectedPiece[0]][this.selectedPiece[1]]
          this.board[this.selectedPiece[0]][this.selectedPiece[1]] = ""
          this.board[rowIndex][colIndex] = piece
          this.selectedPiece = [undefined,undefined]
          // this.canMove = [
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          //   [false,false,false,false,false,false,false,false,],
          // ]
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

        if(rowIndex === 7 && colIndex === 6){
          this.board[rowIndex][colIndex] = "wK"
          this.board[7][5] = "wR"
          this.board[7][7] = ""
          this.board[7][4] = ""
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

        if(rowIndex === 7 && colIndex === 1){
          this.board[rowIndex][colIndex] = "wK"
          this.board[7][2] = "wR"
          this.board[7][0] = ""
          this.board[7][4] = ""
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