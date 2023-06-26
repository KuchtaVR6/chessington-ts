import Board from "../board";
import Square from "../square";
import Piece from "./piece";

export default abstract class CastlingPiece extends Piece {
    private hasBeenMoved : Boolean = false;

    public getHasBeenMoved() {
        return this.hasBeenMoved;
    }

    public moveTo(board: Board, newSquare: Square): void {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
        this.hasBeenMoved = true;
    }
}