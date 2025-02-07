import Piece, { CollisionResponse, PieceTypes } from './piece';
import Player from '../player';
import Board, { moveLog } from '../board';
import Square from '../square';
import GameSettings from '../gameSettings';

export default class Pawn extends Piece {

    public constructor(player: Player) {
        super(player);
    }

    private move(board: Board, myPosition: Square, direction: -1 | 1, initialRow: Number): Square[] {
        let newPossibleMoves = new Array(0);
        let movedByOnePosition: Square | undefined = this.getTransformedPositionWithBoardIfPossible(board, myPosition, direction, 0)
        if (movedByOnePosition) {
            newPossibleMoves.push(movedByOnePosition);
            if (myPosition.row == initialRow) {
                let movedByTwoPosition: Square | undefined = this.getTransformedPositionWithBoardIfPossible(board, myPosition, direction * 2, 0)
                if (movedByTwoPosition) {
                    newPossibleMoves.push(movedByTwoPosition);
                }
            }
        }
        return newPossibleMoves;
    }

    private calculateDistanceRows(firstPosition: Square, secondPosition: Square): number {
        return Math.abs(firstPosition.row - secondPosition.row)
    }

    private calculateDistanceCols(firstPosition: Square, secondPosition: Square): number {
        return Math.abs(firstPosition.col - secondPosition.col)
    }

    private checkIfThePreviousMoveWasADouble(lastMove: moveLog) {
        if (lastMove.movingPiece.getPieceType() === PieceTypes.Pawn) {
            return this.calculateDistanceRows(lastMove.fromSquare, lastMove.toSquare) === 2
        }
        return false
    }

    private checkIfHorizonatallyNextTo(firstPosition: Square, secondPosition: Square) {
        if (firstPosition.row === secondPosition.row)
            return this.calculateDistanceCols(firstPosition, secondPosition) === 1
        return false
    }

    private getEnPassantSquareIfPossible(board: Board, myPosition: Square, direction: -1 | 1): Square | undefined {
        let lastMove = board.getLastMoveIfExists()

        if (lastMove && this.checkIfThePreviousMoveWasADouble(lastMove) && this.checkIfHorizonatallyNextTo(myPosition, lastMove.toSquare)) {
            let newSquare = Square.at(lastMove.toSquare.row + direction, lastMove.toSquare.col)
            return newSquare
        }
    }

    private take(board: Board, myPosition: Square, direction: -1 | 1): Square[] {
        let newPossibleMoves = new Array(0);
        for (let deltaCol = -1; deltaCol <= 1; deltaCol += 2) {
            let square = this.getTransformedPositionIfPossible(myPosition, direction, deltaCol)
            if (square) {
                let attackResponse = this.checkCollision(board, square)
                if (attackResponse === CollisionResponse.canTakeThePiece) {
                    newPossibleMoves.push(square)
                }
            }
        }

        let enPassantOutput = this.getEnPassantSquareIfPossible(board, myPosition, direction);
        if (enPassantOutput) newPossibleMoves.push(enPassantOutput)

        return newPossibleMoves
    }

    private moveWhite(board: Board, myPosition: Square): Square[] {
        return this.move(board, myPosition, 1, 1)
    }

    private moveBlack(board: Board, myPosition: Square): Square[] {
        return this.move(board, myPosition, -1, 6)
    }

    private takeWhite(board: Board, myPosition: Square): Square[] {
        return this.take(board, myPosition, 1)
    }

    private takeBlack(board: Board, myPosition: Square): Square[] {
        return this.take(board, myPosition, -1)
    }

    public getAvailableMoves(board: Board): Square[] {
        let myPosition: Square = board.findPiece(this);
        if (this.player == Player.WHITE) {
            return [...this.moveWhite(board, myPosition),
            ...this.takeWhite(board, myPosition)]
        }
        else {
            return [...this.moveBlack(board, myPosition),
            ...this.takeBlack(board, myPosition)]
        }
    }

    public getPieceType(): PieceTypes {
        return PieceTypes.Pawn;
    }

    public moveTo(board: Board, newSquare: Square): void {

        super.moveTo(board, newSquare);
        let gameRowLimit: number;
        if (this.player === Player.WHITE) { gameRowLimit = GameSettings.BOARD_SIZE - 1 }
        else { gameRowLimit = 0 }

        if (newSquare.row === gameRowLimit) {
            board.replaceWithNewPiece(newSquare, GameSettings.REPLACE_PAWN_WITH)
        }
    }
}
