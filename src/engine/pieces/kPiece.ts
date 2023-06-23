import Board from "../board";
import Square from "../square";
import Piece, {AttackResponse} from "./piece";

export default class PieceThatStartWithALetterK extends Piece {
    protected computeTranformedMovement(board: Board, myPosition: Square, deltaRow: number, deltaCol: number) : Square | undefined {
        let transformed = this.getTransformedPositionWithBoard(board, myPosition, deltaRow, deltaCol);
        if (transformed) return transformed;
        else {
            let attackPosition = this.getTransformedPosition(myPosition, deltaRow, deltaCol)
            if (attackPosition) {
                let attackResponse = this.checkAttack(board, attackPosition)
                if (attackResponse === AttackResponse.canAttack) {
                    return attackPosition;
                }
            }
        }
    }
}