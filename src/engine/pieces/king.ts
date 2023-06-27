import Player from '../player';
import Board from '../board';
import Square from '../square';
import Piece, { PieceTypes } from './piece';
import CastlingPiece from './castling';
import Rook from './rook';
import GameSettings from '../gameSettings';

type PotentialSave = {
    saviour : Piece,
    savingMovesTo : Square[],
}

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

        this.findPieceThatCanBlockOrTakeACheckingPiece(board, myPosition);

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

    private returnAllSpacesOnTheWay(firstSquare: Square, secondSquare: Square) {
        let spacesOnTheWay: Square[] = []

        let rowDiff = Math.abs(firstSquare.row - secondSquare.row);
        let colDiff = Math.abs(firstSquare.col - secondSquare.col);

        if (rowDiff === 0) {
            let colIndexes = [firstSquare.col, secondSquare.col].sort()

            for (let colIndex = colIndexes[0] + 1; colIndex < colIndexes[1]; colIndex++) {
                spacesOnTheWay.push(Square.at(firstSquare.row, colIndex))
            }
        }
        else if (colDiff === 0) {
            let rowIndexes = [firstSquare.row, secondSquare.row].sort()

            for (let rowIndex = rowIndexes[0] + 1; rowIndex < rowIndexes[1]; rowIndex++) {
                spacesOnTheWay.push(Square.at(rowIndex, firstSquare.col))
            }
        }
        else if (colDiff === rowDiff) {
            let rowIndexes = [firstSquare.row, secondSquare.row].sort()
            let colIndexes = [firstSquare.col, secondSquare.col].sort()

            for (let diffrenceInEachDimension = 1; diffrenceInEachDimension < colDiff; diffrenceInEachDimension++) {
                spacesOnTheWay.push(Square.at(rowIndexes[0] + diffrenceInEachDimension, colIndexes[0] + diffrenceInEachDimension))
            }
        }
        else {
            throw new Error("The path cannot be convered with a straight line.")
        }

        return spacesOnTheWay;
    }


    private findPieceThatCanBlockOrTakeACheckingPiece(board: Board, myPosition: Square) {
        let squaresThatCanSave: Square[] = [];
        let numberOfPiecesEndangeringTheKing = 0;
        let neighbouringSquaresThatAreUnsafe : Square[] = [];
        for (let rowIndex = 0; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            for (let colIndex = 0; colIndex < GameSettings.BOARD_SIZE; colIndex++) {
                let currentPiece = board.getPiece(Square.at(rowIndex, colIndex));
                if (currentPiece !== undefined) {
                    // piece present
                    if (currentPiece.player !== this.player) {
                        // piece is enemy
                        let moves = currentPiece.getAvailableMoves(board)
                        for (let kingDeltaRow = -1; kingDeltaRow <= 1; kingDeltaRow++) {
                            for (let kingDeltaCol = -1; kingDeltaCol <= 1; kingDeltaCol++) {
                                if (kingDeltaRow == 0 && kingDeltaCol == 0) {
                                    if (this.squareArrayIncludes(moves, myPosition)) {
                                        numberOfPiecesEndangeringTheKing += 1;
                                        if (numberOfPiecesEndangeringTheKing > 1) {
                                            return [];
                                        }
                                        // piece can attack
                                        squaresThatCanSave = [...this.returnAllSpacesOnTheWay(myPosition, Square.at(rowIndex, colIndex)), Square.at(rowIndex, colIndex)]
                                    }
                                }
                                else {
                                    let squareThatNeighboursTheKing = Square.at(myPosition.row + kingDeltaRow, myPosition.col + kingDeltaCol);
                                    if (this.squareArrayIncludes(moves, squareThatNeighboursTheKing)) {
                                        neighbouringSquaresThatAreUnsafe.push(squareThatNeighboursTheKing);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let movesThatCanUncheck : PotentialSave[] = [];

        for (let rowIndex = 0; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            for (let colIndex = 0; colIndex < GameSettings.BOARD_SIZE; colIndex++) {
                let currentPiece = board.getPiece(Square.at(rowIndex, colIndex));
                if (currentPiece !== undefined) {
                    // piece present
                    if (currentPiece.player !== this.player) {
                        let savingMoves : Square[] = [];
                        // piece is friendly
                        let moves = currentPiece.getAvailableMoves(board)
                        for (let move of squaresThatCanSave) {
                            if (this.squareArrayIncludes(moves, move)) {
                                savingMoves.push(move)
                            }
                        }

                        if (savingMoves.length > 0) {
                            movesThatCanUncheck.push({
                                saviour : currentPiece,
                                savingMovesTo : savingMoves
                            })
                        }
                    }
                }
            }
        }

        return movesThatCanUncheck;
    }
}
