import { useState } from "react";
import {
    COLOR_LABELS,
    ERROR_TAG_LABELS,
    RESULT_LABELS,
    TIME_CONTROL_LABELS,
} from "./const";
import { validateGame } from "./validation";

const EMPTY_VALUES = {
    title: "",
    color: "",
    result: "",
    time_control: "",
    opening: "",
    opponent_rating: "",
    notes: "",
    pgn: "",
    error_tags: [],
};

export function GameForm({ onAdd }) {
    const [form, setForm] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState({});

    // Serve para qualquer campo: o `name` do input diz qual chave do estado mudar.
    function handleChange(event) {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    // Marcar adiciona a tag na lista; desmarcar remove.
    function handleTagChange(event) {
        const { value, checked } = event.target;
        const tags = checked
            ? [...form.error_tags, value]
            : form.error_tags.filter((tag) => tag !== value);
        setForm({ ...form, error_tags: tags });
    }

    function handleSubmit(event) {
        event.preventDefault(); // impede o navegador de recarregar a página

        const result = validateGame(form);
        setErrors(result.errors);
        if (Object.keys(result.errors).length > 0) return; // há erros: não envia

        onAdd(result.values);
        setForm(EMPTY_VALUES); // limpa o formulário
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="game-title">Título</label>
            <input id="game-title" name="title" value={form.title} onChange={handleChange} />
            {errors.title && <p role="alert">{errors.title}</p>}

            <fieldset>
                <legend>Cor</legend>
                {Object.entries(COLOR_LABELS).map(([value, label]) => (
                    <label key={value}>
                        <input
                            type="radio"
                            name="color"
                            value={value}
                            checked={form.color === value}
                            onChange={handleChange}
                        />
                        {label}
                    </label>
                ))}
                {errors.color && <p role="alert">{errors.color}</p>}
            </fieldset>

            <fieldset>
                <legend>Resultado</legend>
                {Object.entries(RESULT_LABELS).map(([value, label]) => (
                    <label key={value}>
                        <input
                            type="radio"
                            name="result"
                            value={value}
                            checked={form.result === value}
                            onChange={handleChange}
                        />
                        {label}
                    </label>
                ))}
                {errors.result && <p role="alert">{errors.result}</p>}
            </fieldset>

            <label htmlFor="game-time-control">Ritmo</label>
            <select
                id="game-time-control"
                name="time_control"
                value={form.time_control}
                onChange={handleChange}
            >
                <option value="">Selecione</option>
                {Object.entries(TIME_CONTROL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            {errors.time_control && <p role="alert">{errors.time_control}</p>}

            <label htmlFor="game-opening">Abertura</label>
            <input id="game-opening" name="opening" value={form.opening} onChange={handleChange} />
            {errors.opening && <p role="alert">{errors.opening}</p>}

            <label htmlFor="game-rating">Rating do oponente</label>
            <input
                id="game-rating"
                name="opponent_rating"
                inputMode="numeric"
                value={form.opponent_rating}
                onChange={handleChange}
            />
            {errors.opponent_rating && <p role="alert">{errors.opponent_rating}</p>}

            <label htmlFor="game-notes">Notas</label>
            <textarea id="game-notes" name="notes" rows={4} value={form.notes} onChange={handleChange} />
            {errors.notes && <p role="alert">{errors.notes}</p>}

            <label htmlFor="game-pgn">PGN</label>
            <textarea id="game-pgn" name="pgn" rows={4} value={form.pgn} onChange={handleChange} />

            <fieldset>
                <legend>Tags de erro</legend>
                {Object.entries(ERROR_TAG_LABELS).map(([value, label]) => (
                    <label key={value}>
                        <input
                            type="checkbox"
                            value={value}
                            checked={form.error_tags.includes(value)}
                            onChange={handleTagChange}
                        />
                        {label}
                    </label>
                ))}
            </fieldset>

            <button type="submit">Adicionar partida</button>
        </form>
    );
}