import Player from '../player';
import Board from '../board';
import Square from '../square';
import GameSettings from '../gameSettings';

export enum CollisionResponse {
    noCollision,
    cannotTakeThePiece,
    canTakeThePiece,
}

enum LateralDirection {
    horizontal,
    vertical,
}

enum Change {
    increasing,
    decreasing,
}

export enum PieceTypes {
    King,
    Queen,
    Rook,
    Bishop,
    Knight,
    Pawn,
}

export default abstract class Piece {
    public player: Player;

    public constructor(player: Player) {
        this.player = player;
    }

    public getAvailableMoves(board: Board): Square[] {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    protected checkCollision(board: Board, position: Square): CollisionResponse {
        let pieceInTheSquare = board.getPiece(position)

        if (pieceInTheSquare) {
            if (pieceInTheSquare.player === this.player || pieceInTheSquare.getPieceType() === PieceTypes.King) {
                return CollisionResponse.cannotTakeThePiece
            }
            else return CollisionResponse.canTakeThePiece
        }
        else {
            return CollisionResponse.noCollision
        }
    }

    protected computeTranformedMovementIfPossible(board: Board, myPosition: Square, deltaRow: number, deltaCol: number) : Square | undefined {
        let transformed = this.getTransformedPositionWithBoardIfPossible(board, myPosition, deltaRow, deltaCol);
        if (transformed) return transformed;
        else {
            let attackPosition = this.getTransformedPositionIfPossible(myPosition, deltaRow, deltaCol)
            if (attackPosition) {
                let attackResponse = this.checkCollision(board, attackPosition)
                if (attackResponse === CollisionResponse.canTakeThePiece) {
                    return attackPosition;
                }
            }
        }
    }

    private forLoopParamsForComputeToEdge(myPosition: Square, direction: LateralDirection, change: Change) : { start : number, step : number, condition : (index : number) => boolean} {
        let start, step: number;

        let condition: (index: number) => boolean;

        switch (change) {
            case Change.increasing: {
                step = 1
                condition = (index) => { return index < GameSettings.BOARD_SIZE }
                switch (direction) {
                    case LateralDirection.horizontal: {
                        start = myPosition.col + 1
                        break;
                    }
                    case LateralDirection.vertical: {
                        start = myPosition.row + 1
                        break;
                    }
                }
                break;
            }
            case Change.decreasing: {
                step = -1
                condition = (index) => { return index >= 0 }
                switch (direction) {
                    case LateralDirection.horizontal: {
                        start = myPosition.col - 1
                        break;
                    }
                    case LateralDirection.vertical: {
                        start = myPosition.row - 1
                        break;
                    }
                }
                break;
            }
        }

        return {
            start : start, 
            step : step,
            condition : condition
        }
    }

    private computeToTheEdge(board: Board, myPosition: Square, direction: LateralDirection, change: Change) : Square[] {

        let params = this.forLoopParamsForComputeToEdge(myPosition, direction, change)

        let start = params.start;
        let step = params.step;

        let condition = params.condition;

        let newPossibleMoves = [];

        for (let index = start; condition(index); index += step) {
            let consideredSquare;

            switch (direction) {
                case LateralDirection.horizontal: {consideredSquare = Square.at(myPosition.row, index); break;}
                case LateralDirection.vertical: {consideredSquare = Square.at(index, myPosition.col); break;}
            }

            let attackResponse = this.checkCollision(board, consideredSquare)
            if (attackResponse !== CollisionResponse.noCollision) {
                if (attackResponse === CollisionResponse.canTakeThePiece) {
                    newPossibleMoves.push(consideredSquare);
                }
                break;
            }
            newPossibleMoves.push(consideredSquare)
        }

        return newPossibleMoves;
    }

    protected computeOneHorizontal(board: Board, myPosition: Square): Square[] {
        return [
            ...this.computeToTheEdge(board, myPosition, LateralDirection.horizontal, Change.increasing),
            ...this.computeToTheEdge(board, myPosition, LateralDirection.horizontal, Change.decreasing)
        ]
    }

    protected computeOneVertical(board: Board, myPosition: Square): Square[] {
        return [
            ...this.computeToTheEdge(board, myPosition, LateralDirection.vertical, Change.increasing),
            ...this.computeToTheEdge(board, myPosition, LateralDirection.vertical, Change.decreasing)
        ]
    }

    protected getTransformedPositionIfPossible(myPosition: Square, deltaRow: number, deltaCol: number): Square | undefined {
        let newRow = myPosition.row + deltaRow;
        let newCol = myPosition.col + deltaCol;
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            if (!(newRow === myPosition.row && newCol === myPosition.col)) {
                return Square.at(newRow, newCol);
            }
        }
    }

    protected getTransformedPositionWithBoardIfPossible(board: Board, myPosition: Square, deltaRow: number, deltaCol: number): Square | undefined {
        let newRow = myPosition.row + deltaRow;
        let newCol = myPosition.col + deltaCol;
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            let finalSquare = Square.at(newRow, newCol);
            if (board.getPiece(finalSquare) === undefined) {
                return finalSquare
            }
        }
    }

    protected getPositionWithBoardIfPossible(board: Board, newRow: number, newCol: number): Square | undefined {
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            let finalSquare = Square.at(newRow, newCol);
            if (board.getPiece(finalSquare) === undefined) {
                return finalSquare
            }
        }
    }

    public moveTo(board: Board, newSquare: Square): void {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }

    public abstract getPieceType() : PieceTypes
}
