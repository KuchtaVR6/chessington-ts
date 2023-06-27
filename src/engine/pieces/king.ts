import Player from '../player';
import Board from '../board';
import Square from '../square';
import Piece, { PieceTypes } from './piece';
import CastlingPiece from './castling';
import Rook from './rook';
import GameSettings from '../gameSettings';

export default class King extends CastlingPiece {
    public constructor(player: Player) {
        super(player);
    }

    public checkIfCastlingPathClear(board: Board, myPosition: Square, direction: -1 | 1) {

        let forLoopLimiter: (index: number) => boolean;
        if (direction === 1) {
            forLoopLimiter = (index) => { return index < GameSettings.BOARD_SIZE - 1; }
        }
        else {
            forLoopLimiter = (index) => { return index > 0; };
        }

        for (let colIndex = myPosition.col + direction; forLoopLimiter(colIndex); colIndex += direction) {
            if (board.getPiece(Square.at(myPosition.row, colIndex)) !== undefined) {
                return false;
            }
        }
        return true;
    }

    private canCastle(board: Board, myPosition: Square, direction: -1 | 1): boolean {
        let rookPosition: number;

        if (direction === 1) rookPosition = GameSettings.BOARD_SIZE - 1;
        else rookPosition = 0;

        let potentialRook = board.getPiece(Square.at(myPosition.row, rookPosition));
        if (potentialRook?.getPieceType() === PieceTypes.Rook && !(potentialRook as Rook).getHasBeenMoved()) {
            return this.checkIfCastlingPathClear(board, myPosition, direction);
        }
        return false
    }

    private canCastleLeft(board: Board, myPosition: Square): boolean {
        return this.canCastle(board, myPosition, -1)
    }

    private canCastleRight(board: Board, myPosition: Square): boolean {
        return this.canCastle(board, myPosition, 1)
    }


    public getAvailableMoves(board: Board): Square[] {
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

        if (!this.getHasBeenMoved()) {
            if (this.canCastleLeft(board, myPosition)) { newPossibleMoves.push(Square.at(myPosition.row, 2)) }
            if (this.canCastleRight(board, myPosition)) { newPossibleMoves.push(Square.at(myPosition.row, 6)) }
        }

        return newPossibleMoves;
    }

    public getPieceType(): PieceTypes {
        return PieceTypes.King;
    }
}
