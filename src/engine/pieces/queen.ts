import Piece from './piece';
import Player from '../player';
import Board from '../board';
import DiagonalPiece from './diagonalPiece';
import Square from '../square';

export default class Queen extends DiagonalPiece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);
        return [
            ...this.computeTopLeftDiagonal(board, myPosition), 
            ...this.computeTopRightDiagonal(board, myPosition),
            ...this.computeOneHorizontal(board, myPosition),
            ...this.computeOneVertical(board, myPosition)
        ];
    }
}
