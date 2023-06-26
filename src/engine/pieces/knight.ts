import Player from '../player';
import Board from '../board';
import Square from '../square';
import Piece from './piece';

export default class Knight extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);
        let newPossibleMoves = new Array(0);

        let combinationsOfNegativeAndPositive = [
            [1, 1],
            [-1, 1],
            [1, - 1],
            [-1, -1]
        ]
        for (let deltaRow = 1; deltaRow <= 2; deltaRow++) {
            let deltaCol = 3 - deltaRow;
            combinationsOfNegativeAndPositive.map((combination) => {
                let transformed = this.computeTranformedMovementIfPossible(board, myPosition, deltaRow * combination[0], deltaCol * combination[1]);
                if (transformed) {
                    newPossibleMoves.push(transformed);
                }
            })
        }
        return newPossibleMoves;
    }
}
