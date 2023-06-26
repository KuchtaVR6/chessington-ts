import GameSettings from "../gameSettings";
import Square from "../square";
import Piece, { CollisionResponse } from "./piece";
import Board from "../board";

export default abstract class DiagonalPiece extends Piece {
    private computeOneDiagonal(board: Board, myPosition: Square, direction: -1 | 1) : Square[] {
        let newPossibleMoves = new Array(0);
        for(let rowIndex = myPosition.row - 1; rowIndex >= 0; rowIndex--) {
            let distance = myPosition.row - rowIndex;
            let colIndex = myPosition.col + distance * direction;
            let newSquare = this.getPositionWithBoard(board, rowIndex, colIndex);
            if (newSquare) newPossibleMoves.push(newSquare);
            else {
                let occupiedSquare = Square.at(rowIndex, colIndex);
                if (this.checkCollision(board, occupiedSquare) === CollisionResponse.canTakeThePiece) {
                    newPossibleMoves.push(occupiedSquare);
                }
                break;
            }
        }

        for (let rowIndex = myPosition.row + 1; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            let distance = myPosition.row - rowIndex;
            let colIndex = myPosition.col + distance * direction;
            let newSquare = this.getPositionWithBoard(board, rowIndex, colIndex);
            if (newSquare) newPossibleMoves.push(newSquare);
            else {
                let occupiedSquare = Square.at(rowIndex, colIndex);
                if (this.checkCollision(board, occupiedSquare) === CollisionResponse.canTakeThePiece) {
                    newPossibleMoves.push(occupiedSquare);
                }
                break;
            }
        }
        return newPossibleMoves;
    }

    protected computeTopLeftDiagonal(board: Board, myPosition: Square) : Square[] {
        return this.computeOneDiagonal(board, myPosition, -1)
    }

    protected computeTopRightDiagonal(board: Board, myPosition: Square) : Square[] {
        return this.computeOneDiagonal(board, myPosition, 1)
    }

}