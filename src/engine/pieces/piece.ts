import Player from '../player';
import Board from '../board';
import Square from '../square';
import GameSettings from '../gameSettings';

export default class Piece {
    public player: Player;

    public constructor(player: Player) {
        this.player = player;
    }

    public getAvailableMoves(board: Board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    protected computeOneHorizontal(board : Board, myPosition : Square) {
        let newPossibleMoves = new Array(0);

        // going left
        for(let index = myPosition.col - 1; index >= 0; index--) {
            let consideredSquare = Square.at(myPosition.row, index)
            if(board.getPiece(consideredSquare) !== undefined) break;
            newPossibleMoves.push(consideredSquare)
        }

        // going right
        for(let index = myPosition.col + 1; index < GameSettings.BOARD_SIZE; index++) {
            let consideredSquare = Square.at(myPosition.row, index)
            if(board.getPiece(consideredSquare) !== undefined) break;
            newPossibleMoves.push(consideredSquare)
        }
        return newPossibleMoves;
    }

    protected computeOneVertical(board : Board, myPosition : Square) {
        let newPossibleMoves = new Array(0);

        // going down
        for(let index = myPosition.row - 1; index >= 0; index--) {
            let consideredSquare = Square.at(index, myPosition.col)
            if(board.getPiece(consideredSquare) !== undefined) break;
            newPossibleMoves.push(consideredSquare)
        }

        // going up
        for(let index = myPosition.row + 1; index < GameSettings.BOARD_SIZE; index++) {
            let consideredSquare = Square.at(index, myPosition.col)
            if(board.getPiece(consideredSquare) !== undefined) break;
            newPossibleMoves.push(consideredSquare)
        }
        return newPossibleMoves;
    }

    protected getTransformedPosition(myPosition: Square, deltaRow: number, deltaCol: number) {
        let newRow = myPosition.row + deltaRow;
        let newCol = myPosition.col + deltaCol;
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            if(!(newRow === myPosition.row && newCol === myPosition.col)) {
                return Square.at(newRow, newCol);
            }
        }
    }

    protected getTransformedPositionWithBoard(board : Board, myPosition: Square, deltaRow: number, deltaCol: number) {
        let newRow = myPosition.row + deltaRow;
        let newCol = myPosition.col + deltaCol;
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            let finalSquare = Square.at(newRow, newCol);
            if(board.getPiece(finalSquare) === undefined) {
                return finalSquare
            }
        }
    }

    protected getPositionWithBoard(board : Board, rowIndex: number, colIndex: number) {
        let newRow = rowIndex;
        let newCol = colIndex;
        if (newRow >= 0 && newRow < GameSettings.BOARD_SIZE && newCol >= 0 && newCol < GameSettings.BOARD_SIZE) {
            let finalSquare = Square.at(newRow, newCol);
            if(board.getPiece(finalSquare) === undefined) {
                return finalSquare
            }
        }
    }

    public moveTo(board: Board, newSquare: Square) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
    }
}
