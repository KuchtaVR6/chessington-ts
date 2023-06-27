import Board from "../../../src/engine/board";
import Bishop from "../../../src/engine/pieces/bishop";
import King from "../../../src/engine/pieces/king";
import Pawn from "../../../src/engine/pieces/pawn";
import Queen from "../../../src/engine/pieces/queen";
import Rook from "../../../src/engine/pieces/rook";
import Player from "../../../src/engine/player";
import Square from "../../../src/engine/square";

describe('Check', () => {
    let board: Board;
    beforeEach(() => board = new Board());

    it('requires the player to move the king away', () => {
        const king = new King(Player.WHITE);
        const attacker = new Rook(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(7, 4), attacker)

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(4)
        moves.should.not.deep.include(Square.at(1, 4));
    })

    it('player cannot move their king into a check', () => {
        const king = new King(Player.WHITE);
        const attacker = new Rook(Player.BLACK)
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(7, 3), attacker)

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(4)
        moves.should.not.deep.include(Square.at(0, 3));
    })

    it('allows friendlies to block attacks on the king', () => {
        const king = new King(Player.WHITE);
        const blocker = new Rook(Player.WHITE);
        const attacker = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(4, 0), blocker);
        board.setPiece(Square.at(7, 4), attacker);

        const moves = blocker.getAvailableMoves(board);

        moves.length.should.equal(1)
        moves.should.deep.include(Square.at(4, 4));
    })

    it('blocks movements of piece which would not protect the king', () => {
        const king = new King(Player.WHITE);
        const unrelated = new Pawn(Player.WHITE);
        const attacker = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(4, 0), unrelated);
        board.setPiece(Square.at(7, 4), attacker);

        const moves = unrelated.getAvailableMoves(board);

        moves.length.should.equal(0);
    })

    it('piece can attack the piece checking the king', () => {
        const king = new King(Player.WHITE);
        const attackerOfTheAttacker = new Rook(Player.WHITE);
        const attacker = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(7, 0), attackerOfTheAttacker);
        board.setPiece(Square.at(7, 4), attacker);

        const moves = attackerOfTheAttacker.getAvailableMoves(board);

        moves.length.should.equal(1);
        moves.should.deep.include(Square.at(7,4))
    })


    it('blocks that create new attack windows should be disallowed', () => {
        const king = new King(Player.WHITE);
        const blocker = new Bishop(Player.WHITE);
        const attackerTop = new Rook(Player.BLACK);
        const attackerSide = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 2), blocker);
        board.setPiece(Square.at(7, 4), attackerTop);
        board.setPiece(Square.at(0, 0), attackerSide);

        const moves = blocker.getAvailableMoves(board);

        moves.length.should.equal(0);
        moves.should.not.deep.include(Square.at(2, 4))
    })

    it('checkmate removes movement from king', () => {
        const king = new King(Player.WHITE);
        const attackerTopLeft = new Rook(Player.BLACK);
        const attackerTopRight = new Rook(Player.BLACK);
        board.setPiece(Square.at(2, 0), king);
        board.setPiece(Square.at(7, 0), attackerTopLeft);
        board.setPiece(Square.at(7, 1), attackerTopRight);

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(0);
    })

    it('king cannot move into a check', () => {
        const king = new King(Player.WHITE);
        const attackerTopLeft = new Rook(Player.BLACK);
        board.setPiece(Square.at(2, 1), king);
        board.setPiece(Square.at(7, 0), attackerTopLeft);

        const moves = king.getAvailableMoves(board);

        moves.length.should.equal(5);
        moves.should.not.deep.include(Square.at(1, 0))
        moves.should.not.deep.include(Square.at(2, 0))
        moves.should.not.deep.include(Square.at(3, 0))
    })
})