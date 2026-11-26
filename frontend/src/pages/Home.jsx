import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchHeroes } from "../api/heroes.js";

export default function Home() {
    const [heroes, setHeroes] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        fetchHeroes(controller.signal)
            .then((data) => {
                setHeroes(data);
                setStatus("ready");
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setError(err.message);
                setStatus("error");
            });

        return () => controller.abort();
    }, []);

    return (
        <main className="page">
            <header className="page-header">
                <h1>Deadlock Builds</h1>
                <p>Escolha um herói para criar ou ver builds.</p>
            </header>

            {status === "loading" && <p>Carregando heróis...</p>}
            {status === "error" && <p role="alert">{error}</p>}
            {status === "ready" && heroes.length === 0 && (
                <p>Nenhum herói encontrado.</p>
            )}

            {status === "ready" && heroes.length > 0 && (
                <ul className="hero-grid">
                    {heroes.map((hero) => (
                        <li key={hero.id}>
                            <Link
                                to={`/heroes/${hero.id}`}
                                className="hero-card"
                                style={{ "--hero-color": hero.color_style }}
                            >
                                <img
                                    src={hero.icon_url}
                                    alt=""
                                    width="96"
                                    height="96"
                                    loading="lazy"
                                />
                                <strong>{hero.name}</strong>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
