import { validateGame } from "@/components/validation";
import { describe, expect, it } from "vitest";

const required = { title: "title", color: "white", result: "win", time_control: "blitz" };

describe("validateGame", () => {
    it("aceita só os obrigatórios e normaliza opcionais para null", () => {
        const { errors, values } = validateGame(required);
        expect(errors).toEqual({});
        expect(values).toMatchObject({
            opening: null,
            opponent_rating: null,
            notes: null,
            error_tags: [],
        });
    });

    it("exige cor, resultado e ritmo", () => {
        const { errors } = validateGame({});
        expect(Object.keys(errors)).toEqual(["title", "color", "result", "time_control"]);
    });

    it.each(["0", "3500", "1450"])("aceita rating %s", (rating) => {
        const { errors, values } = validateGame({ ...required, opponent_rating: rating });
        expect(errors.opponent_rating).toBeUndefined();
        expect(values.opponent_rating).toBe(Number(rating));
    });

    it.each(["-1", "3501", "14.5", "abc"])("rejeita rating %s", (rating) => {
        const { errors } = validateGame({ ...required, opponent_rating: rating });
        expect(errors.opponent_rating).toBeDefined();
    });

    it("rejeita abertura com mais de 80 caracteres", () => {
        const { errors } = validateGame({ ...required, opening: "a".repeat(81) });
        expect(errors.opening).toBeDefined();
    });

    it("remove tags duplicadas e rejeita tags desconhecidas", () => {
        const dup = validateGame({ ...required, error_tags: ["time_trouble", "time_trouble"] });
        expect(dup.values.error_tags).toEqual(["time_trouble"]);

        const invalid = validateGame({ ...required, error_tags: ["inventada"] });
        expect(invalid.errors.error_tags).toBeDefined();
    });
});