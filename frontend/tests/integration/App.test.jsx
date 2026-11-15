import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

vi.mock("../../src/components/FinalPosition", () => ({ default: () => null }));

// Ajuste se o seu App usar outro texto
const LOADING_TEXT = /carregando/i;
const EMPTY_TEXT = "Nenhuma partida cadastrada.";

let fetchMock;

beforeEach(() => {
	fetchMock = vi.fn();
	vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

// Resposta mínima compatível com request(): usa ok, status e json()
function jsonResponse(body, status = 200) {
	return {
		ok: status >= 200 && status < 300,
		status,
		json: async () => body,
	};
}

function makeGame(overrides = {}) {
	return {
		id: 1,
		title: "Partida",
		color: "white",
		result: "win",
		time_control: "rapid",
		opening: null,
		opponent_rating: null,
		notes: null,
		pgn: null,
		error_tags: [],
		played_at: "2026-11-14T23:20:28.609782Z",
		...overrides,
	};
}

// GET inicial devolvendo a lista informada
function mockInitialGames(games = []) {
	fetchMock.mockResolvedValueOnce(jsonResponse(games));
}

async function renderLoaded(games = []) {
	mockInitialGames(games);
	render(<App />);
	if (games.length === 0) {
		await screen.findByText(EMPTY_TEXT);
	} else {
		await screen.findByText(games[0].title);
	}
}

async function fillRequired(user, title) {
	await user.type(screen.getByLabelText("Título"), title);
	await user.click(screen.getByRole("radio", { name: "Brancas" }));
	await user.click(screen.getByRole("radio", { name: "Vitória" }));
	await user.selectOptions(screen.getByLabelText("Ritmo"), "rapid");
}

async function submit(user) {
	await user.click(screen.getByRole("button", { name: "Adicionar partida" }));
}

describe("App: carregamento da lista", () => {
	it("mostra o estado de carregando enquanto o GET não responde", () => {
		fetchMock.mockReturnValue(new Promise(() => {})); // nunca resolve
		render(<App />);

		expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
		expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
	});

	it("chama GET /games ao montar", async () => {
		await renderLoaded();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/\/games$/);
		expect(init?.method ?? "GET").toBe("GET");
	});

	it("mostra a lista vazia quando a API devolve []", async () => {
		await renderLoaded([]);

		expect(screen.getByText(EMPTY_TEXT)).toBeInTheDocument();
		expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();
	});

	it("renderiza as partidas devolvidas pela API", async () => {
		await renderLoaded([
			makeGame({ id: 2, title: "Segunda", result: "loss" }),
			makeGame({ id: 1, title: "Primeira", result: "win" }),
		]);

		const items = screen.getAllByRole("listitem");
		expect(items).toHaveLength(2);
		expect(items[0]).toHaveTextContent("Segunda");
		expect(items[0]).toHaveTextContent("Derrota");
		expect(items[1]).toHaveTextContent("Primeira");
		expect(items[1]).toHaveTextContent("Vitória");
	});

	it("mostra o estado de carregando enquanto o GET não responde", () => {
		fetchMock.mockReturnValue(new Promise(() => {}));
		render(<App />);

		expect(screen.getByRole("status")).toHaveTextContent(LOADING_TEXT);
		expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
	});

	it("mostra o erro, esconde o carregando e não mostra lista vazia quando a API responde 500", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: "Falha no servidor" }, 500),
		);
		render(<App />);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Falha no servidor",
		);
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
	});

	it("mostra o erro quando a rede falha", async () => {
		fetchMock.mockRejectedValueOnce(new Error("Failed to fetch"));
		render(<App />);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Failed to fetch",
		);
		expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
	});
});

describe("App: formulário", () => {
	it("mostra os erros e não faz POST com o formulário vazio", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		await submit(user);

		expect(screen.getAllByRole("alert")).toHaveLength(4);
		expect(screen.getByText(EMPTY_TEXT)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(1); // só o GET inicial
	});

	it("some com os erros depois de corrigir e enviar de novo", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		await submit(user);
		expect(screen.getAllByRole("alert")).toHaveLength(4);

		fetchMock.mockResolvedValueOnce(
			jsonResponse(makeGame({ id: 1, title: "Agora vai" }), 201),
		);
		await fillRequired(user, "Agora vai");
		await submit(user);

		await screen.findByText("Agora vai");
		expect(screen.queryAllByRole("alert")).toHaveLength(0);
	});
});

describe("App: cadastro de partida", () => {
	it("envia POST /games com o payload correto, exibe a partida e limpa o form", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		fetchMock.mockResolvedValueOnce(
			jsonResponse(makeGame({ id: 10, title: "Derrota feia" }), 201),
		);
		await fillRequired(user, "Derrota feia");
		await submit(user);

		const list = await screen.findByRole("list");
		expect(within(list).getByText("Derrota feia")).toBeInTheDocument();
		expect(within(list).getByText("Vitória")).toBeInTheDocument();
		expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();

		expect(fetchMock).toHaveBeenCalledTimes(2);
		const [url, init] = fetchMock.mock.calls[1];
		expect(url).toMatch(/\/games$/);
		expect(init.method).toBe("POST");
		expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
		expect(JSON.parse(init.body)).toEqual({
			title: "Derrota feia",
			color: "white",
			result: "win",
			time_control: "rapid",
			opening: null,
			opponent_rating: null,
			notes: null,
			pgn: null,
			error_tags: [],
		});

		expect(screen.getByLabelText("Título")).toHaveValue("");
		expect(screen.getByRole("radio", { name: "Brancas" })).not.toBeChecked();
	});

	it("usa o id e a data que vêm do servidor, não os do cliente", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				makeGame({
					id: 99,
					title: "Do servidor",
					played_at: "2026-01-02T15:00:00Z",
				}),
				201,
			),
		);
		await fillRequired(user, "Do servidor");
		await submit(user);

		const item = (await screen.findByText("Do servidor")).closest("li");
		expect(item).toHaveTextContent("02/01/2026");
		const body = JSON.parse(fetchMock.mock.calls[1][1].body);
		expect(body).not.toHaveProperty("id");
		expect(body).not.toHaveProperty("played_at");
	});

	it("coloca a partida mais recente no topo da lista", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		fetchMock
			.mockResolvedValueOnce(
				jsonResponse(makeGame({ id: 1, title: "Primeira" }), 201),
			)
			.mockResolvedValueOnce(
				jsonResponse(makeGame({ id: 2, title: "Segunda" }), 201),
			);

		await fillRequired(user, "Primeira");
		await submit(user);
		await screen.findByText("Primeira");

		await fillRequired(user, "Segunda");
		await submit(user);
		await screen.findByText("Segunda");

		const items = screen.getAllByRole("listitem");
		expect(items[0]).toHaveTextContent("Segunda");
		expect(items[1]).toHaveTextContent("Primeira");
	});

	it("mostra o erro, mantém os campos e não adiciona a partida quando o POST falha", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: "Não foi possível salvar" }, 500),
		);
		await fillRequired(user, "Não salva");
		await submit(user);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Não foi possível salvar",
		);
		expect(screen.getByLabelText("Título")).toHaveValue("Não salva");
		expect(screen.getByRole("radio", { name: "Brancas" })).toBeChecked();
		expect(
			screen.queryByText("Não salva", {
				selector: "h3, [data-slot='card-title']",
			}),
		).not.toBeInTheDocument();
		expect(screen.getByText(EMPTY_TEXT)).toBeInTheDocument();
	});

	it("limpa o erro de salvamento ao tentar de novo com sucesso", async () => {
		const user = userEvent.setup();
		await renderLoaded();

		fetchMock
			.mockResolvedValueOnce(jsonResponse({ detail: "Falhou" }, 500))
			.mockResolvedValueOnce(
				jsonResponse(makeGame({ id: 1, title: "Dessa vez" }), 201),
			);

		await fillRequired(user, "Dessa vez");
		await submit(user);
		expect(await screen.findByRole("alert")).toHaveTextContent("Falhou");

		await submit(user); // os campos foram mantidos, basta reenviar
		await screen.findByText("Dessa vez");
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
