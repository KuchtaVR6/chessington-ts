import GameSettings from "../gameSettings";
import Square from "../square";
import Piece, { AttackResponse } from "./piece";
import Board from "../board";

export default abstract class DiagonalPiece extends Piece {
    private computeOneDiagonal(board: Board, myPosition: Square, direction: -1 | 1) : Square[] {
        let newPossibleMoves = new Array(0);
        for(let index = myPosition.row - 1; index >= 0; index--) {
            let diff = myPosition.row - index;
            let col = myPosition.col + diff * direction;
            let newSquare = this.getPositionWithBoard(board, index, col);
            if (newSquare) newPossibleMoves.push(newSquare);
            else {
                let occupiedSquare = Square.at(index, col);
                if (this.checkAttack(board, occupiedSquare) === AttackResponse.canAttack) {
                    newPossibleMoves.push(occupiedSquare);
                }
                break;
            }
        }

        for (let index = myPosition.row + 1; index < GameSettings.BOARD_SIZE; index++) {
            let diff = myPosition.row - index;
            let col = myPosition.col + diff * direction;
            let newSquare = this.getPositionWithBoard(board, index, col);
            if (newSquare) newPossibleMoves.push(newSquare);
            else {
                let occupiedSquare = Square.at(index, col);
                if (this.checkAttack(board, occupiedSquare) === AttackResponse.canAttack) {
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