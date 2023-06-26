import Piece, { CollisionResponse } from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square';

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    private move(board: Board, myPosition: Square, direction: -1 | 1, initialRow: Number) : Square[] {
        let newPossibleMoves = new Array(0);
        let movedByOne : Square | undefined = this.getTransformedPositionWithBoardIfPossible(board, myPosition, direction, 0)
        if (movedByOne) {
            newPossibleMoves.push(movedByOne);
            if (myPosition.row == initialRow) {
                let movedByTwo : Square | undefined = this.getTransformedPositionWithBoardIfPossible(board, myPosition, direction * 2, 0)
                if (movedByTwo) {
                    newPossibleMoves.push(movedByTwo);
                }
            }
        }
        return newPossibleMoves;
    }

    private take(board : Board, myPosition : Square, direction: -1 | 1) : Square[] {
        let newPossibleMoves = new Array(0);
        for (let deltaCol = -1; deltaCol <= 1; deltaCol+=2) {
            let square = this.getTransformedPositionIfPossible(myPosition, direction, deltaCol)
            if (square) {
                let attackResponse = this.checkCollision(board, square)
                if (attackResponse === CollisionResponse.canTakeThePiece) {
                    newPossibleMoves.push(square)
                }
            }
        }
        return newPossibleMoves
    }

    private moveWhite(board : Board, myPosition : Square) : Square[] {
        return this.move(board, myPosition, 1, 1)  
    }

    private moveBlack(board : Board, myPosition : Square) : Square[] {
        return this.move(board, myPosition, -1, 6)  
    }

    private takeWhite(board : Board, myPosition : Square) : Square[] {
        return this.take(board, myPosition, 1)  
    }

    private takeBlack(board : Board, myPosition : Square) : Square[] {
        return this.take(board, myPosition, -1)  
    }

    public getAvailableMoves(board: Board) : Square[] {
        let myPosition: Square = board.findPiece(this);
        if (this.player == Player.WHITE) {
            return [...this.moveWhite(board, myPosition),
                ...this.takeWhite(board, myPosition) ]   
        }
        else {
            return [...this.moveBlack(board, myPosition),
                ...this.takeBlack(board, myPosition)]
        }
    }
}
