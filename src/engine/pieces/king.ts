import Player from '../player';
import Board from '../board';
import Square from '../square';
import Piece from './piece';

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);
        let newPossibleMoves = new Array(0);

        for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
            for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
                let transformed = this.computeTranformedMovementIfPossible(board, myPosition, deltaRow, deltaCol);
                if (transformed) {
                    newPossibleMoves.push(transformed);
                }
            }
        }
        return newPossibleMoves;
    }

    public isKing(): boolean {
        return true
    }
}
