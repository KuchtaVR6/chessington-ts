import Piece, { PieceTypes } from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';
import CastlingPiece from './castling';

export default class Rook extends CastlingPiece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);

        return [...this.computeOneHorizontal(board, myPosition), ...this.computeOneVertical(board, myPosition)]
    }

    public getPieceType(): PieceTypes {
        return PieceTypes.Rook;
    }
}
