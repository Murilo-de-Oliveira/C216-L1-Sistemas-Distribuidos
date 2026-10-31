import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameForm } from "../../src/components/GameForm";

async function fillRequired(user) {
    await user.type(screen.getByLabelText("Título"), "teste");
    await user.click(screen.getByRole("radio", { name: "Pretas" }));
    await user.click(screen.getByRole("radio", { name: "Vitória" }));
    await user.selectOptions(screen.getByLabelText("Ritmo"), "rapid");
}

describe("GameForm", () => {
    it("mostra erros e não chama onAdd com os obrigatórios vazios", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();
        render(<GameForm onAdd={onAdd} />);

        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        expect(screen.getAllByRole("alert")).toHaveLength(4);
        expect(screen.getByText("O título é obrigatório.")).toBeInTheDocument();
        expect(screen.getByText("Escolha a cor.")).toBeInTheDocument();
        expect(onAdd).not.toHaveBeenCalled();
    });

    it("rejeita rating inválido", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();
        render(<GameForm onAdd={onAdd} />);

        await fillRequired(user);
        await user.type(screen.getByLabelText("Rating do oponente"), "4000");
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        expect(screen.getByRole("alert")).toHaveTextContent("entre 0 e 3500");
        expect(screen.getByLabelText("Rating do oponente")).toHaveAttribute("aria-invalid", "true");
        expect(onAdd).not.toHaveBeenCalled();
    });

    it("envia os valores normalizados e limpa o formulário", async () => {
        const user = userEvent.setup();
        const onAdd = vi.fn();
        render(<GameForm onAdd={onAdd} />);

        await fillRequired(user);
        await user.type(screen.getByLabelText("Abertura"), "  Italiana  ");
        await user.type(screen.getByLabelText("Rating do oponente"), "1500");
        await user.click(screen.getByRole("checkbox", { name: "Peça pendurada" }));
        await user.click(screen.getByRole("checkbox", { name: "Pouco tempo" }));
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        expect(onAdd).toHaveBeenCalledWith({
            title: "teste",
            color: "black",
            result: "win",
            time_control: "rapid",
            opening: "Italiana",
            opponent_rating: 1500,
            notes: null,
            pgn: null,
            error_tags: ["hanging_piece", "time_trouble"],
        });

        expect(screen.getByLabelText("Título")).toHaveValue("");
        expect(screen.getByLabelText("Abertura")).toHaveValue("");
        expect(screen.getByLabelText("Ritmo")).toHaveValue("");
        expect(screen.getByRole("radio", { name: "Pretas" })).not.toBeChecked();
        expect(screen.getByRole("checkbox", { name: "Peça pendurada" })).not.toBeChecked();
    });
});