import Player from '../player';
import Board from '../board';
import Square from '../square';
import DiagonalPiece from './diagonalPiece';
import { PieceTypes } from './piece';

export default class Bishop extends DiagonalPiece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);
        return [...this.computeTopLeftDiagonal(board, myPosition), ...this.computeTopRightDiagonal(board, myPosition)];
    }

    public getPieceType(): PieceTypes {
        return PieceTypes.Bishop;
    }
}
