import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const selectClass =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function GameForm({ onAdd }) {
    const [form, setForm] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState({});

    function handleChange(event) {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    function handleTagChange(event) {
        const { value, checked } = event.target;
        const tags = checked
            ? [...form.error_tags, value]
            : form.error_tags.filter((tag) => tag !== value);
        setForm({ ...form, error_tags: tags });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const result = validateGame(form);
        setErrors(result.errors);
        if (Object.keys(result.errors).length > 0) return;

        onAdd(result.values);
        setForm(EMPTY_VALUES);
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 rounded-lg border bg-card p-4 shadow-sm"
        >
            <div className="space-y-1.5">
                <Label htmlFor="game-title">Título</Label>
                <Input
                    id="game-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    aria-invalid={!!errors.title}
                />
                {errors.title && (
                    <p role="alert" className="text-sm text-destructive">
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Cor (radios) */}
            <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium">Cor</legend>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(COLOR_LABELS).map(([value, label]) => (
                        <Label key={value} className="font-normal">
                            <input
                                type="radio"
                                name="color"
                                value={value}
                                checked={form.color === value}
                                onChange={handleChange}
                                className="size-4 accent-primary"
                            />
                            {label}
                        </Label>
                    ))}
                </div>
                {errors.color && (
                    <p role="alert" className="text-sm text-destructive">
                        {errors.color}
                    </p>
                )}
            </fieldset>

            <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium">Resultado</legend>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(RESULT_LABELS).map(([value, label]) => (
                        <Label key={value} className="font-normal">
                            <input
                                type="radio"
                                name="result"
                                value={value}
                                checked={form.result === value}
                                onChange={handleChange}
                                className="size-4 accent-primary"
                            />
                            {label}
                        </Label>
                    ))}
                </div>
                {errors.result && (
                    <p role="alert" className="text-sm text-destructive">
                        {errors.result}
                    </p>
                )}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="game-time-control">Ritmo</Label>
                    <select
                        id="game-time-control"
                        name="time_control"
                        value={form.time_control}
                        onChange={handleChange}
                        aria-invalid={!!errors.time_control}
                        className={selectClass}
                    >
                        <option value="">Selecione</option>
                        {Object.entries(TIME_CONTROL_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.time_control && (
                        <p role="alert" className="text-sm text-destructive">
                            {errors.time_control}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="game-rating">Rating do oponente</Label>
                    <Input
                        id="game-rating"
                        name="opponent_rating"
                        inputMode="numeric"
                        value={form.opponent_rating}
                        onChange={handleChange}
                        aria-invalid={!!errors.opponent_rating}
                    />
                    {errors.opponent_rating && (
                        <p role="alert" className="text-sm text-destructive">
                            {errors.opponent_rating}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="game-opening">Abertura</Label>
                <Input
                    id="game-opening"
                    name="opening"
                    value={form.opening}
                    onChange={handleChange}
                    aria-invalid={!!errors.opening}
                />
                {errors.opening && (
                    <p role="alert" className="text-sm text-destructive">
                        {errors.opening}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="game-notes">Notas</Label>
                <Textarea
                    id="game-notes"
                    name="notes"
                    rows={4}
                    value={form.notes}
                    onChange={handleChange}
                    aria-invalid={!!errors.notes}
                />
                {errors.notes && (
                    <p role="alert" className="text-sm text-destructive">
                        {errors.notes}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="game-pgn">PGN</Label>
                <Textarea
                    id="game-pgn"
                    name="pgn"
                    rows={4}
                    value={form.pgn}
                    onChange={handleChange}
                    className="font-mono"
                />
            </div>

            <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium">Tags de erro</legend>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {Object.entries(ERROR_TAG_LABELS).map(([value, label]) => (
                        <Label key={value} className="font-normal">
                            <input
                                type="checkbox"
                                value={value}
                                checked={form.error_tags.includes(value)}
                                onChange={handleTagChange}
                                className="size-4 accent-primary"
                            />
                            {label}
                        </Label>
                    ))}
                </div>
            </fieldset>

            <Button type="submit" className="w-full sm:w-auto">
                Adicionar partida
            </Button>
        </form>
    );
}