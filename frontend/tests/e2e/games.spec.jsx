import { expect, test } from "@playwright/test";

const PGN = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6";

async function fillRequired(page, title) {
    await page.getByLabel("Título").fill(title);
    await page.getByLabel("Brancas").check();
    await page.getByLabel("Vitória").check();
    await page.getByLabel("Ritmo").selectOption("rapid");
}

test("mostra os erros ao enviar o formulário vazio", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Adicionar partida" }).click();

    await expect(page.getByText("O título é obrigatório.")).toBeVisible();
    await expect(page.getByText("Escolha a cor.")).toBeVisible();
    await expect(page.getByText("Escolha o resultado.")).toBeVisible();
    await expect(page.getByText("Escolha o ritmo de jogo.")).toBeVisible();
});

test("cadastra uma partida e a exibe na lista", async ({ page }) => {
    const title = `Partida ${Date.now()}`;
    await page.goto("/");

    await fillRequired(page, title);
    await page.getByLabel("Abertura").fill("Ruy Lopez");
    await page.getByLabel("PGN").fill(PGN);
    await page.getByRole("button", { name: "Adicionar partida" }).click();

    const card = page.getByRole("listitem").filter({ hasText: title });
    await expect(card).toBeVisible();
    await expect(card.getByText("Vitória")).toBeVisible();
    await expect(card.getByText("PGN inválido")).toHaveCount(0);

    await expect(page.getByLabel("Título")).toHaveValue("");
});

test("avisa quando o PGN é inválido", async ({ page }) => {
    const title = `PGN ruim ${Date.now()}`;
    await page.goto("/");

    await fillRequired(page, title);
    await page.getByLabel("PGN").fill("1. e9 e5");
    await page.getByRole("button", { name: "Adicionar partida" }).click();

    const card = page.getByRole("listitem").filter({ hasText: title });
    await expect(card.getByText("PGN inválido")).toBeVisible();
});