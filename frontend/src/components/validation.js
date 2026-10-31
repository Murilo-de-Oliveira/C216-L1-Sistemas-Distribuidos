import { COLOR_LABELS, ERROR_TAG_LABELS, RESULT_LABELS, TIME_CONTROL_LABELS } from "./const";

export const OPENING_MAX_LENGTH = 80;
export const NOTES_MAX_LENGTH = 500;
export const RATING_MAX = 3500;

export function validateGame({
    title,
    color,
    result,
    time_control,
    opening = "",
    opponent_rating = "",
    notes = "",
    error_tags = [],
    pgn = ""
}) {
    const errors = {};
    const trimmedTitle = title.trim();
    if (!trimmedTitle) errors.title = "O título é obrigatório.";
    else if (trimmedTitle.length > 100) errors.title = "O título deve ter no máximo 100 caracteres.";


    if (!Object.hasOwn(COLOR_LABELS, color)) errors.color = "Escolha a cor.";
    if (!Object.hasOwn(RESULT_LABELS, result)) errors.result = "Escolha o resultado.";
    if (!Object.hasOwn(TIME_CONTROL_LABELS, time_control)) {
        errors.time_control = "Escolha o ritmo de jogo.";
    }

    const trimmedOpening = opening.trim();
    if (trimmedOpening.length > OPENING_MAX_LENGTH) {
        errors.opening = `A abertura deve ter no máximo ${OPENING_MAX_LENGTH} caracteres.`;
    }

    const ratingText = String(opponent_rating).trim();
    let rating = null;
    if (ratingText !== "") {
        rating = Number(ratingText);
        if (!/^\d+$/.test(ratingText) || rating > RATING_MAX) {
            errors.opponent_rating = `O rating deve ser um inteiro entre 0 e ${RATING_MAX}.`;
        }
    }

    const trimmedNotes = notes.trim();
    if (trimmedNotes.length > NOTES_MAX_LENGTH) {
        errors.notes = `As notas devem ter no máximo ${NOTES_MAX_LENGTH} caracteres.`;
    }

    const tags = [...new Set(error_tags)];
    if (tags.some((tag) => !Object.hasOwn(ERROR_TAG_LABELS, tag))) {
        errors.error_tags = "Há uma tag de erro inválida.";
    }

    return {
        errors,
        values: {
            title: trimmedTitle,
            color,
            result,
            time_control,
            opening: trimmedOpening || null,
            opponent_rating: rating,
            notes: trimmedNotes || null,
            error_tags: tags,
            pgn: pgn.trim() || null
        },
    };
}