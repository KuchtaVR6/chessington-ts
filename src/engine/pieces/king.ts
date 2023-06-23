import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let myPosition: Square = board.findPiece(this);
        let newPossibleMoves = new Array(0);

        for(let deltaRow=-1;deltaRow<=1;deltaRow++) {
            for(let deltaCol=-1;deltaCol<=1;deltaCol++) {
                let transformed = this.getTransformedPosition(myPosition, deltaRow, deltaCol);
                if (transformed) newPossibleMoves.push(transformed)
            }
        }
        return newPossibleMoves;
    }
}
