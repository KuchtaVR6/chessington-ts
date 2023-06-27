import { PieceTypes } from "./pieces/piece";

const GameSettings = Object.freeze({
    BOARD_SIZE: 8,
    REPLACE_PAWN_WITH: PieceTypes.Queen
});

export default GameSettings;
