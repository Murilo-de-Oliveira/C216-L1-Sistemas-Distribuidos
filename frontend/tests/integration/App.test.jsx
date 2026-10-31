import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../../src/App";

vi.mock("../../src/seed", () => ({ initialGames: [] }));
vi.mock("../../src/components/FinalPosition", () => ({ default: () => null }));

async function fillRequired(user, title) {
    await user.type(screen.getByLabelText("Título"), title);
    await user.click(screen.getByRole("radio", { name: "Brancas" }));
    await user.click(screen.getByRole("radio", { name: "Vitória" }));
    await user.selectOptions(screen.getByLabelText("Ritmo"), "rapid");
}

describe("App", () => {
    it("começa com a lista vazia", () => {
        render(<App />);

        expect(screen.getByText("Nenhuma partida cadastrada.")).toBeInTheDocument();
    });

    it("mostra os erros e não cadastra com o formulário vazio", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        expect(screen.getAllByRole("alert")).toHaveLength(4);
        expect(screen.getByText("Nenhuma partida cadastrada.")).toBeInTheDocument();
    });

    it("cadastra uma partida, a exibe na lista e limpa o formulário", async () => {
        const user = userEvent.setup();
        render(<App />);

        await fillRequired(user, "Derrota feia");
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        const list = screen.getByRole("list");
        expect(within(list).getByText("Derrota feia")).toBeInTheDocument();
        expect(within(list).getByText("Vitória")).toBeInTheDocument();
        expect(screen.queryByText("Nenhuma partida cadastrada.")).not.toBeInTheDocument();

        expect(screen.getByLabelText("Título")).toHaveValue("");
        expect(screen.getByRole("radio", { name: "Brancas" })).not.toBeChecked();
    });

    it("some com os erros depois de corrigir e enviar de novo", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));
        expect(screen.getAllByRole("alert")).toHaveLength(4);

        await fillRequired(user, "Agora vai");
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        expect(screen.queryAllByRole("alert")).toHaveLength(0);
    });

    it("coloca a partida mais recente no topo da lista", async () => {
        const user = userEvent.setup();
        render(<App />);

        await fillRequired(user, "Primeira");
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));
        await fillRequired(user, "Segunda");
        await user.click(screen.getByRole("button", { name: "Adicionar partida" }));

        const items = screen.getAllByRole("listitem");
        expect(items[0]).toHaveTextContent("Segunda");
        expect(items[1]).toHaveTextContent("Primeira");
    });
});