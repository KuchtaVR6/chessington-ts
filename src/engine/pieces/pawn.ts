import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    private move(board: Board, myPosition: Square, direction: -1 | 1, initialRow: Number) {
        let newPossibleMoves = new Array(0);
        let movedByOne : Square | undefined = this.getTransformedPositionWithBoard(board, myPosition, direction, 0)
        if (movedByOne) {
            newPossibleMoves.push(movedByOne);
            if (myPosition.row == initialRow) {
                let movedByTwo : Square | undefined = this.getTransformedPositionWithBoard(board, myPosition, direction * 2, 0)
                if (movedByTwo) {
                    newPossibleMoves.push(movedByTwo);
                }
            }
        }
        return newPossibleMoves;
    }

    private moveWhite(board : Board, myPosition : Square) {
        return this.move(board, myPosition, 1, 1)  
    }

    private moveBlack(board : Board, myPosition : Square) {
        return this.move(board, myPosition, -1, 6)  
    }

    public getAvailableMoves(board: Board) {
        let myPosition: Square = board.findPiece(this);
        if (this.player == Player.WHITE) {
            return this.moveWhite(board, myPosition)   
        }
        else {
            return this.moveBlack(board, myPosition);
        }
    }
}
