// GET /heroes (FastAPI). O prefixo /api é reescrito pelo proxy do Vite.
export async function fetchHeroes(signal) {
    const response = await fetch("/api/heroes/all_heroes", { signal });
    if (!response.ok) {
        throw new Error(`Erro ao carregar heróis (HTTP ${response.status})`);
    }
    return response.json();
}
