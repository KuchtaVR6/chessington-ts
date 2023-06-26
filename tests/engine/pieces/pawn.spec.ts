import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from '../../../src/engine/pieces/rook';
import King from '../../../src/engine/pieces/king';

describe('Pawn', () => {

    let board: Board;
    beforeEach(() => board = new Board());

    describe('white pawns', () => {

        it('can only move one square up if they have already moved', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 0), pawn);
            pawn.moveTo(board, Square.at(2, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(3, 0));
        });

        it('can move one or two squares up on their first move', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(1, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(2, 7), Square.at(3, 7)]);
        });

        it('cannot move at the top of the board', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(7, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(5, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.WHITE);
            const friendlyPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingKing = new King(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(5, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(5, 3));
        });

        it('can en passant if opposing pawn moved two squares', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(3, 3), pawn);
            board.setPiece(Square.at(6, 4), opposingPawn);

            pawn.moveTo(board, Square.at(4, 3));
            opposingPawn.moveTo(board, Square.at(4, 4));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include(Square.at(5, 4));
        });

        it('can en passant symmetrically if opposing pawn is in between', () => {
            const leftPawn = new Pawn(Player.WHITE);
            const rightPawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(3, 3), leftPawn);
            board.setPiece(Square.at(4, 5), rightPawn);
            board.setPiece(Square.at(6, 4), opposingPawn);
            leftPawn.moveTo(board, Square.at(4, 3));
            opposingPawn.moveTo(board, Square.at(4, 4));

            const leftPawnMoves = leftPawn.getAvailableMoves(board);
            const rightPawnMoves = rightPawn.getAvailableMoves(board);

            leftPawnMoves.should.have.length(2);
            leftPawnMoves.should.deep.include(Square.at(5, 4));
            rightPawnMoves.should.have.length(2);
            rightPawnMoves.should.deep.include(Square.at(5, 4));
        });

        it('opposing pawn disappears after en passant', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(3, 3), pawn);
            board.setPiece(Square.at(6, 4), opposingPawn);

            pawn.moveTo(board, Square.at(4, 3));
            opposingPawn.moveTo(board, Square.at(4, 4));
            pawn.moveTo(board, Square.at(5, 4));

            const pieceDisappeared = board.getPiece(Square.at(4, 4));

            // once we know how to check "should.be.undefined" to be deleted

            let thisNeedsToBeDELETED = true;

            if (pieceDisappeared === undefined) {
                thisNeedsToBeDELETED.should.to.equal(true);
            }
            else {
                thisNeedsToBeDELETED.should.to.equal(false);
            }
        });

        it('cannot en passant if opposing pawn moved two squares but not immediately prior', () => {
            const pawn = new Pawn(Player.WHITE);
            const pawnToProgressTheGame = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            const opposingToProgressTheGame = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 3), pawn);
            board.setPiece(Square.at(1, 0), pawnToProgressTheGame);
            board.setPiece(Square.at(6, 4), opposingPawn);
            board.setPiece(Square.at(6, 0), opposingToProgressTheGame);
            pawnToProgressTheGame.moveTo(board, Square.at(2, 0))
            opposingPawn.moveTo(board, Square.at(4, 4));
            pawnToProgressTheGame.moveTo(board, Square.at(3, 0));
            opposingToProgressTheGame.moveTo(board, Square.at(5, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.not.deep.include(Square.at(5, 4));
        });

        it('cannot en passant if opposing pawn moved one square', () => {
            const pawn = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(3, 3), pawn);
            board.setPiece(Square.at(4, 5), opposingPawn);
            pawn.moveTo(board, Square.at(4, 3));
            opposingPawn.moveTo(board, Square.at(4, 4));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.not.deep.include(Square.at(4, 4));
        });

        it('cannot en passant if opposing pawn moved from another column', () => {
            const pawn = new Pawn(Player.WHITE);
            const pawnToTake = new Pawn(Player.WHITE);
            const opposingPawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(3, 3), pawn);
            board.setPiece(Square.at(4, 4), pawnToTake);
            board.setPiece(Square.at(5, 5), opposingPawn);
            pawn.moveTo(board, Square.at(4, 3));
            opposingPawn.moveTo(board, Square.at(4, 4));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.not.deep.include(Square.at(4, 4));
        });
    });

    describe('black pawns', () => {

        let board: Board;
        beforeEach(() => board = new Board(Player.BLACK));

        it('can only move one square down if they have already moved', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 0), pawn);
            pawn.moveTo(board, Square.at(5, 0));

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(1);
            moves.should.deep.include(Square.at(4, 0));
        });

        it('can move one or two squares down on their first move', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(6, 7), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.have.length(2);
            moves.should.deep.include.members([Square.at(4, 7), Square.at(5, 7)]);
        });

        it('cannot move at the bottom of the board', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(0, 3), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.be.empty;
        });

        it('can move diagonally if there is a piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingPiece = new Rook(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.deep.include(Square.at(3, 3));
        });

        it('cannot move diagonally if there is no piece to take', () => {
            const pawn = new Pawn(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take a friendly piece', () => {
            const pawn = new Pawn(Player.BLACK);
            const friendlyPiece = new Rook(Player.BLACK);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), friendlyPiece);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });

        it('cannot take the opposing king', () => {
            const pawn = new Pawn(Player.BLACK);
            const opposingKing = new King(Player.WHITE);
            board.setPiece(Square.at(4, 4), pawn);
            board.setPiece(Square.at(3, 3), opposingKing);

            const moves = pawn.getAvailableMoves(board);

            moves.should.not.deep.include(Square.at(3, 3));
        });
    });

    it('cannot move if there is a piece in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(5, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.be.empty;
    });

    it('cannot move two squares if there is a piece two sqaures in front', () => {
        const pawn = new Pawn(Player.BLACK);
        const blockingPiece = new Rook(Player.WHITE);
        board.setPiece(Square.at(6, 3), pawn);
        board.setPiece(Square.at(4, 3), blockingPiece);

        const moves = pawn.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 3));
    });

    it('can en passant if opposing pawn moved two squares', () => {
        const pawn = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), pawn);
        board.setPiece(Square.at(1, 4), opposingPawn);
        opposingPawn.moveTo(board, Square.at(3, 4));

        const moves = pawn.getAvailableMoves(board);

        moves.should.have.length(2);
        moves.should.deep.include(Square.at(2, 4));
    });

    it('can en passant symmetrically if opposing pawn is in between', () => {
        const leftPawn = new Pawn(Player.BLACK);
        const rightPawn = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), leftPawn);
        board.setPiece(Square.at(3, 5), rightPawn);
        board.setPiece(Square.at(1, 4), opposingPawn);
        opposingPawn.moveTo(board, Square.at(3, 4));

        const leftPawnMoves = leftPawn.getAvailableMoves(board);
        const rightPawnMoves = rightPawn.getAvailableMoves(board);

        leftPawnMoves.should.have.length(2);
        leftPawnMoves.should.deep.include(Square.at(2, 4));
        rightPawnMoves.should.have.length(2);
        rightPawnMoves.should.deep.include(Square.at(2, 4));
    });

    it('opposing pawn disappears after en passant', () => {
        const pawn = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), pawn);
        board.setPiece(Square.at(1, 4), opposingPawn);
        opposingPawn.moveTo(board, Square.at(3, 4));
        pawn.moveTo(board, Square.at(2, 4));

        const pieceDisappeared = board.getPiece(Square.at(3, 4));

        // once we know how to check "should.be.undefined" to be deleted

        let thisNeedsToBeDELETED = true;

        if (pieceDisappeared === undefined) {
            thisNeedsToBeDELETED.should.to.equal(true);
        }
        else {
            thisNeedsToBeDELETED.should.to.equal(false);
        }
    });

    it('cannot en passant if opposing pawn moved two squares but not immediately prior', () => {
        const pawn = new Pawn(Player.BLACK);
        const pawnToProgressTheGame = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        const opposingPawnToProgressTheGame = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), pawn);
        board.setPiece(Square.at(6, 0), pawnToProgressTheGame);
        board.setPiece(Square.at(1, 4), opposingPawn);
        board.setPiece(Square.at(1, 0), opposingPawnToProgressTheGame);
        opposingPawn.moveTo(board, Square.at(3, 4));
        pawnToProgressTheGame.moveTo(board, Square.at(5, 0));
        opposingPawnToProgressTheGame.moveTo(board, Square.at(2, 0));

        const moves = pawn.getAvailableMoves(board);

        moves.should.have.length(1);
        moves.should.not.deep.include(Square.at(2, 4));
    });

    it('cannot en passant if opposing pawn moved one square', () => {
        const pawn = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), pawn);
        board.setPiece(Square.at(2, 4), opposingPawn);
        opposingPawn.moveTo(board, Square.at(3, 4));

        const moves = pawn.getAvailableMoves(board);

        moves.should.have.length(1);
        moves.should.not.deep.include(Square.at(2, 4));
    });

    it('cannot en passant if opposing pawn moved from another column', () => {
        const pawn = new Pawn(Player.BLACK);
        const pawnToTake = new Pawn(Player.BLACK);
        const opposingPawn = new Pawn(Player.WHITE);
        board.setPiece(Square.at(3, 3), pawn);
        board.setPiece(Square.at(3, 4), pawnToTake);
        board.setPiece(Square.at(2, 5), opposingPawn);
        opposingPawn.moveTo(board, Square.at(3, 4));

        const moves = pawn.getAvailableMoves(board);

        moves.should.have.length(1);
        moves.should.not.deep.include(Square.at(2, 4));
    });
});
