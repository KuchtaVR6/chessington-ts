import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Piece, { PieceTypes } from './pieces/piece';
import King from './pieces/king';
import Queen from './pieces/queen';
import Rook from './pieces/rook';
import Bishop from './pieces/bishop';
import Knight from './pieces/knight';
import Pawn from './pieces/pawn';

export type moveLog = {
    fromSquare: Square,
    toSquare: Square,
    movingPiece: Piece
}

export default class Board {
    public currentPlayer: Player;
    private readonly board: (Piece | undefined)[][];

    private lastMoveRegister: moveLog | undefined;

    public constructor(currentPlayer?: Player) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
    }

    public setPiece(square: Square, piece: Piece | undefined) {
        this.board[square.row][square.col] = piece;
    }

    public getPiece(square: Square) {
        return this.board[square.row][square.col];
    }

    public findPiece(pieceToFind: Piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    private calculateDistance(fromSquare: Square, toSquare: Square): [number, number] {
        return [Math.abs(fromSquare.row - toSquare.row), Math.abs(fromSquare.col - toSquare.col)]
    }

    private checkIfMoveIsEnPassant(fromSquare: Square, toSquare: Square, movingPiece: Piece): boolean {
        if (movingPiece.getPieceType() === PieceTypes.Pawn) {
            let distance = this.calculateDistance(fromSquare, toSquare)
            if (distance[0] === 1 && distance[1] === 1) {
                let potentiallyTaken = this.getPiece(Square.at(fromSquare.row, toSquare.col))
                if (potentiallyTaken) {
                    return potentiallyTaken.player !== movingPiece.player
                }
            }
        }
        return false;
    }

    private checkIfMoveIsCastling(fromSquare: Square, toSquare: Square, movingPiece: Piece) {
        if (movingPiece.getPieceType() === PieceTypes.King) {
            return this.calculateDistance(fromSquare, toSquare)[1] > 1
        }
        return false;
    }

    private getPieceInstance(pieceType: PieceTypes, player: Player) {
        switch (pieceType) {
            case PieceTypes.King: return new King(player);
            case PieceTypes.Queen: return new Queen(player);
            case PieceTypes.Rook: return new Rook(player);
            case PieceTypes.Bishop: return new Bishop(player);
            case PieceTypes.Knight: return new Knight(player);
            case PieceTypes.Pawn: return new Pawn(player);
        }
    }

    public replaceWithNewPiece(position: Square, pieceType: PieceTypes) {
        if (pieceType === PieceTypes.King || pieceType === PieceTypes.Pawn)
            throw new Error("Piece cannot be cast into King nor Pawn.")

        const pieceToReplace = this.getPiece(position);
        if (pieceToReplace) {
            this.setPiece(position, undefined);
            this.setPiece(position, this.getPieceInstance(pieceType, pieceToReplace.player));
        }
        else {
            throw new Error("No piece present to be replaced.")
        }
    }

    public movePiece(fromSquare: Square, toSquare: Square) {
        const movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.lastMoveRegister = {
                fromSquare: fromSquare,
                toSquare: toSquare,
                movingPiece: movingPiece
            }

            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);

            if (this.checkIfMoveIsEnPassant(fromSquare, toSquare, movingPiece)) {
                this.setPiece(Square.at(fromSquare.row, toSquare.col), undefined)
            }

            if (this.checkIfMoveIsCastling(fromSquare, toSquare, movingPiece)) {
                let rookMovedTo, rookWasAt;
                if (toSquare.col === 6) {
                    rookMovedTo = 5;
                    rookWasAt = 7;
                }
                else {
                    rookMovedTo = 3;
                    rookWasAt = 0;
                }
                let rook = this.getPiece(Square.at(toSquare.row, rookWasAt));
                this.setPiece(Square.at(toSquare.row, rookMovedTo), rook);
                this.setPiece(Square.at(toSquare.row, rookWasAt), undefined);
            }
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }
    }

    public getLastMoveIfExists(): moveLog | undefined {
        return this.lastMoveRegister
    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    private isMyKingSafe(player : Player) : boolean {

    }

    protected squareArrayIncludes(array : Square[], elementSearchedFor : Square) : boolean {
        for(let elementOfArray of array) {
            if (elementOfArray.equals(elementSearchedFor)) {
                return true
            }
        }
        return false
    }

    private returnCopyOfTheBoard() : (Piece | undefined)[][] {
        let boardCopy : (Piece | undefined)[][] = [];
        for(let row of this.board) {
            let currentRowCopy : (Piece | undefined)[] = [];
            for(let element of row) {
                currentRowCopy.push(element);
            }
            boardCopy.push(currentRowCopy);
        }
        return boardCopy;
    }

    private getPiecesOfPlayer(player : Player) : Piece[] {
        let arrayOfPieces : Piece[] = [];
        for (let rowIndex = 0; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            for (let colIndex = 0; colIndex < GameSettings.BOARD_SIZE; colIndex++) {
                let currentPiece = this.getPiece(Square.at(rowIndex, colIndex));
                if (currentPiece && currentPiece.player === player) {
                    arrayOfPieces.push(currentPiece)
                }
            }
        }
        return arrayOfPieces;
    }

    private checkIfKingsMoveWouldCheckWhenMoved(kingsPosition : Square, deltaRow : -1 | 0 | 1, deltaCol: -1 | 0 | 1) {
        if (deltaRow === 0 && deltaCol === 0) throw new Error("This function is not intendend for the position of the King")
        let boardCopy = this.returnCopyOfTheBoard();

        // removing the king
        boardCopy[kingsPosition.row][kingsPosition.col] = undefined;

        for (let rowIndex = 0; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            for (let colIndex = 0; colIndex < GameSettings.BOARD_SIZE; colIndex++) {
    }

    private findCheckingTheKing(myPosition : Square, king : Piece) {
        let squaresThatCanSave: Square[] = [];
        let numberOfPiecesEndangeringTheKing = 0;
        let neighbouringSquaresThatAreUnsafe : Square[] = [];
        for (let rowIndex = 0; rowIndex < GameSettings.BOARD_SIZE; rowIndex++) {
            for (let colIndex = 0; colIndex < GameSettings.BOARD_SIZE; colIndex++) {
                let currentPiece = this.getPiece(Square.at(rowIndex, colIndex));
                if (currentPiece !== undefined) {
                    // piece present
                    if (currentPiece.player !== king.player) {
                        // piece is enemy
                        let moves = currentPiece.getAvailableMoves(this)
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

        if (this.getPiece(myPosition)?.getPieceType() === PieceTypes.King) {
            // pass
        }
        else {
            
        }
    }
}
