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

        if (!this.getHasBeenMoved()) {
            let rookPositions = [Square.at(myPosition.row, 7), Square.at(myPosition.row, 0)];
            for (let i = 0; i < rookPositions.length; i++) {
                let canCastle = false;
                let rook = board.getPiece(rookPositions[i]);
                if (rook?.getPieceType() === PieceTypes.Rook) {
                    if (!(rook as Rook).getHasBeenMoved()) {
                        canCastle = true;
                        for (let j = (i === 0? 5 : 3); (i === 0 ? j < GameSettings.BOARD_SIZE - 1: j >= 1); (i === 0? j++ : j--)) {
                            if (board.getPiece(Square.at(myPosition.row, j)) !== undefined) {
                                canCastle = false;
                                break;
                            }
                        }
                    }
                }
                if (canCastle) newPossibleMoves.push((i === 0? Square.at(myPosition.row, 6) : Square.at(myPosition.row, 2)));
            }
        }
        
        return newPossibleMoves;
    }

    public getPieceType(): PieceTypes {
        return PieceTypes.King;
    }
}
