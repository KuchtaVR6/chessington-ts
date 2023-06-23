import GameSettings from "../gameSettings";
import Square from "../square";
import Piece from "./piece";
import Board from "../board";

export default abstract class DiagonalPiece extends Piece {

    protected computeOneDiagonal(board: Board, myPosition: Square, direction: -1 | 1) { // -1: Top-left to bottom-right, 1: Top-right to bottom-left
        let newPossibleMoves = new Array(0);
        for(let index = myPosition.row - 1; index >= 0; index--) {
            let diff = myPosition.row - index;
            let col = myPosition.col + diff * direction;
            let newSquare = this.getPositionWithBoard(board, index, col);
            if (newSquare) newPossibleMoves.push(newSquare);
            else break;
        }

        for (let index = myPosition.row + 1; index < GameSettings.BOARD_SIZE; index++) {
            let diff = myPosition.row - index;
            let col = myPosition.col + diff * direction;
            let newSquare = this.getPositionWithBoard(board, index, col);
            if (newSquare) newPossibleMoves.push(newSquare);
            else break;
        }
        return newPossibleMoves;
    }

}