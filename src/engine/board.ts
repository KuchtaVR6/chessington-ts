import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';

export type moveLog = {
    fromSquare : Square,
    toSquare : Square,
    movingPiece : Piece
}

export default class Board {
    public currentPlayer: Player;
    private readonly board: (Piece | undefined)[][];

    private lastMoveRegister : moveLog | undefined;

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

    private checkIfMoveIsEnPassant(fromSquare : Square, toSquare : Square, movingPiece : Piece) : boolean {
        if(movingPiece.isPawn()) {
            if(Math.abs(fromSquare.col - toSquare.col) === 1 && Math.abs(fromSquare.row - fromSquare.row) === 1)
            {
                let potentiallyTaken = this.getPiece(Square.at(toSquare.col, fromSquare.row))
                if (potentiallyTaken) {
                    if(potentiallyTaken.player !== movingPiece.player) return true;
                }
            }
        }
        return false;
    }

    public movePiece(fromSquare: Square, toSquare: Square) {
        const movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.lastMoveRegister = {
                fromSquare : fromSquare,
                toSquare : toSquare,
                movingPiece : movingPiece
            }
            this.setPiece(toSquare, movingPiece);

            if(this.checkIfMoveIsEnPassant(fromSquare, toSquare, movingPiece)) {
                this.setPiece(Square.at(toSquare.col, fromSquare.row), undefined)
            } else {
                this.setPiece(fromSquare, undefined);
            }
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }
    }

    public getLastMoveIfExists() : moveLog | undefined {
        return this.lastMoveRegister
    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }
}
