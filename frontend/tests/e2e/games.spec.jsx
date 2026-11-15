import { expect, test } from "@playwright/test";

const PGN = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";
const API_URL = process.env.E2E_API_URL ?? "http://localhost:8000";

const isGamesRequest = (res, method) =>
	res.url().endsWith("/games") && res.request().method() === method;

async function fillRequired(page, title) {
	await page.getByLabel("Título", { exact: true }).fill(title);
	await page.getByLabel("Brancas", { exact: true }).check();
	await page.getByLabel("Vitória", { exact: true }).check();
	await page.getByLabel("Ritmo", { exact: true }).selectOption("rapid");
}

const cardOf = (page, title) =>
	page.getByRole("listitem").filter({ hasText: title });

async function submitAndWaitForSave(page) {
	const saved = page.waitForResponse((res) => isGamesRequest(res, "POST"));
	await page.getByRole("button", { name: "Adicionar partida" }).click();
	return saved;
}

async function reloadAndWaitForList(page) {
	const loaded = page.waitForResponse((res) => isGamesRequest(res, "GET"));
	await page.reload();
	const response = await loaded;
	expect(response.ok()).toBe(true);
}

test("mostra os erros ao enviar o formulário vazio", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Adicionar partida" }).click();

	await expect(page.getByText("O título é obrigatório.")).toBeVisible();
	await expect(page.getByText("Escolha a cor.")).toBeVisible();
	await expect(page.getByText("Escolha o resultado.")).toBeVisible();
	await expect(page.getByText("Escolha o ritmo de jogo.")).toBeVisible();
});

test("cadastra uma partida e ela persiste após recarregar a página", async ({
	page,
	request,
}) => {
	const title = `Partida ${Date.now()}`;
	await page.goto("/");

	await fillRequired(page, title);
	await page
		.getByRole("textbox", { name: "Abertura", exact: true })
		.fill("Ruy Lopez");
	await page.getByLabel("PGN").fill(PGN);

	const response = await submitAndWaitForSave(page);
	expect(response.status()).toBe(201);
	const created = await response.json();
	expect(created.id).toBeTruthy();

	const card = cardOf(page, title);
	await expect(card).toBeVisible();
	await expect(card.getByText("Vitória")).toBeVisible();
	await expect(card.getByText("PGN inválido")).toHaveCount(0);
	await expect(page.getByLabel("Título", { exact: true })).toHaveValue("");

	await reloadAndWaitForList(page);

	const reloadedCard = cardOf(page, title);
	await expect(reloadedCard).toBeVisible();
	await expect(reloadedCard.getByText("Vitória")).toBeVisible();
	await expect(reloadedCard.getByText("PGN inválido")).toHaveCount(0);
	await expect(reloadedCard).not.toContainText(/invalid date|data inválida/i);
	await expect(page.getByLabel("Título", { exact: true })).toHaveValue("");

	const apiResponse = await request.get(`${API_URL}/games`);
	expect(apiResponse.ok()).toBe(true);
	expect(await apiResponse.json()).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				id: created.id,
				title,
				color: "white",
				result: "win",
				time_control: "rapid",
				opening: "Ruy Lopez",
				pgn: PGN,
			}),
		]),
	);
});

test("exibe na lista uma partida criada direto pela API", async ({
	page,
	request,
}) => {
	const title = `Via API ${Date.now()}`;
	const created = await request.post(`${API_URL}/games`, {
		data: {
			title,
			color: "black",
			result: "loss",
			time_control: "blitz",
			opening: null,
			opponent_rating: null,
			notes: null,
			pgn: PGN,
			error_tags: ["time_trouble"],
		},
	});
	expect(created.status()).toBe(201);

	await page.goto("/");

	const card = cardOf(page, title);
	await expect(card).toBeVisible();
	await expect(card.getByText("Derrota")).toBeVisible();
});

test("avisa quando o PGN é inválido, inclusive após recarregar", async ({
	page,
}) => {
	const title = `PGN ruim ${Date.now()}`;
	await page.goto("/");

	await fillRequired(page, title);
	await page.getByLabel("PGN").fill("1. e9 e5");

	const response = await submitAndWaitForSave(page);
	expect(response.status()).toBe(201);

	await expect(cardOf(page, title).getByText("PGN inválido")).toBeVisible();

	await reloadAndWaitForList(page);

	await expect(cardOf(page, title).getByText("PGN inválido")).toBeVisible();
});
