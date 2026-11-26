
async function errorMessage(response) {
    try {
        const { detail } = await response.json();
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) {
            return detail
                .map((d) => `${d.loc.slice(1).join(".")}: ${d.msg}`)
                .join("; ");
        }
    } catch {
    }
    return `Erro na requisição (HTTP ${response.status})`;
}

async function request(method, path, { body, signal } = {}) {
    const response = await fetch(`/api${path}`, {
        method,
        signal,
        headers:
            body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        const error = new Error(await errorMessage(response));
        error.status = response.status;
        throw error;
    }
    return response.status === 204 ? null : response.json();
}

export const getJson = (path, signal) => request("GET", path, { signal });
export const postJson = (path, body, signal) =>
    request("POST", path, { body, signal });
