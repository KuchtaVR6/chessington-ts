import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Rook extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let myPosition: Square = board.findPiece(this);

        return [...this.computeOneHorizontal(board, myPosition), ...this.computeOneVertical(board, myPosition)]
    }
}
