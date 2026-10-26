import { Chess } from "chess.js";
import { useMemo } from "react";
import { Chessboard } from "react-chessboard";

export default function FinalPosition({ pgn, size = 200 }) {
    const fen = useMemo(() => {
        try {
            const game = new Chess();
            game.loadPgn(pgn);
            return game.fen();
        } catch {
            return null;
        }
    }, [pgn]);

    if (!fen) return <p>PGN inválido</p>;

    return (
        <div style={{ width: size }}>
            <Chessboard options={
                {
                    position: fen,
                    allowDragging: false,
                    showNotation: false
                }
            } />
        </div>
    );
}