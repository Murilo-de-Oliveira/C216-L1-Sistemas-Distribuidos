export const RESULT_LABELS = { win: "Vitória", loss: "Derrota", draw: "Empate" };
export const COLOR_LABELS = { white: "Brancas", black: "Pretas" };
export const TIME_CONTROL_LABELS = {
    bullet: "Bullet",
    blitz: "Blitz",
    rapid: "Rápida",
    classical: "Clássica",
};
export const ERROR_TAG_LABELS = {
    stalemate_blunder: "Erro de afogamento",
    time_trouble: "Pouco tempo",
    missed_short_tactic: "Tática curta perdida",
    hanging_piece: "Peça pendurada",
    opening_mistake: "Erro de abertura",
    endgame_mistake: "Erro de final",
};
export const RESULT_BADGE_CLASSES = {
    win: "bg-green-50 text-green-700",
    loss: "bg-red-50 text-red-700",
    draw: "bg-slate-100 text-slate-700",
};

export function formatPlayedAt(iso) {
    return new Date(iso).toLocaleDateString("pt-BR");
}