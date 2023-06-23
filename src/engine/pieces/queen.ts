import Piece from './piece';
import Player from '../player';
import Board from '../board';
import DiagonalPiece from './diagonalPiece';
import Square from '../square';

export default class Queen extends DiagonalPiece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let myPosition: Square = board.findPiece(this);
        return [
            ...this.computeOneDiagonal(board, myPosition, 1), 
            ...this.computeOneDiagonal(board, myPosition, -1),
            ...this.computeOneHorizontal(board, myPosition),
            ...this.computeOneVertical(board, myPosition)
        ];
    }
}
