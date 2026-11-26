// GET em JSON. O prefixo /api é reescrito pelo proxy do Vite (ver vite.config.js).
export async function getJson(path, signal) {
    const response = await fetch(`/api${path}`, { signal });
    if (!response.ok) {
        const error = new Error(`Erro na requisição (HTTP ${response.status})`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}
