import King from '../../../src/engine/pieces/king';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Pawn from '../../../src/engine/pieces/pawn';
import Rook from '../../../src/engine/pieces/rook';

describe('King', () => {
    let board: Board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.have.deep.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('can castle to the right', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(6)
        moves.should.deep.include(Square.at(0, 6));
    })

    it('can castle to the left', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(6)
        moves.should.deep.include(Square.at(0, 2));
    })

    it('castling right moves the rook', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);

        king.moveTo(board, Square.at(0, 6));

        let rookPosition = board.findPiece(rook);

        rookPosition.row.should.equal(0);
        rookPosition.col.should.equal(5);
    })

    it('castling left moves the rook', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        king.moveTo(board, Square.at(0, 2));

        let rookPosition = board.findPiece(rook);

        rookPosition.row.should.equal(0);
        rookPosition.col.should.equal(3);
    })

    it('cannot castle after king has been moved', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(1, 4), king);
        board.setPiece(Square.at(0, 7), rook);

        king.moveTo(board, Square.at(0, 4))

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(5)
        moves.should.not.deep.include(Square.at(0, 6));
    })

    it('cannot castle after rook has been moved', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(1, 7), rook);

        rook.moveTo(board, Square.at(0, 7));

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(5)
        moves.should.not.deep.include(Square.at(0, 6));
    })

    it('cannot castle right if pieces in the way', () => {
        const king = new King(Player.WHITE);
        const blocker = new Pawn(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);
        board.setPiece(Square.at(0, 6), blocker)

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(5)
        moves.should.not.deep.include(Square.at(0, 6));
    })

    it('cannot castle left if pieces in the way', () => {
        const king = new King(Player.WHITE);
        const blocker = new Pawn(Player.WHITE);
        const rook = new Rook(Player.WHITE);

        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);
        board.setPiece(Square.at(0, 1), blocker)

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(5)
        moves.should.not.deep.include(Square.at(0, 2));
    })
});
