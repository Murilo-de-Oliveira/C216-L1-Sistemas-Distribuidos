export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const GAMES_URL = `${API_URL}/games`;

async function request(path, options) {
    const res = await fetch(
        path,
        {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
    if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.detail ?? `Erro ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
}

export const listGames = () => request(GAMES_URL);

export const createGame = (values) =>
    request(GAMES_URL, { method: "POST", body: JSON.stringify(values) });