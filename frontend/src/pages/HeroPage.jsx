import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchHero, fetchHeroBuilds } from "../api/heroes.js";

export default function HeroPage() {
    const { heroId } = useParams();
    const [hero, setHero] = useState(null);
    const [builds, setBuilds] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        setStatus("loading");

        Promise.all([
            fetchHero(heroId, controller.signal),
            fetchHeroBuilds(heroId, controller.signal),
        ])
            .then(([heroData, buildsData]) => {
                setHero(heroData);
                setBuilds(buildsData);
                setStatus("ready");
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setError(err.status === 404 ? "Herói não encontrado." : err.message);
                setStatus("error");
            });

        return () => controller.abort();
    }, [heroId]);

    return (
        <main className="page">
            <Link to="/" className="back-link">
                ← Heróis
            </Link>

            {status === "loading" && <p>Carregando...</p>}
            {status === "error" && <p role="alert">{error}</p>}

            {status === "ready" && (
                <>
                    <header
                        className="hero-header"
                        style={{ "--hero-color": hero.color_style }}
                    >
                        <img src={hero.icon_url} alt="" width="128" height="128" />
                        <div>
                            <h1>{hero.name}</h1>
                            <p className="hero-type">
                                {[hero.hero_type, hero.role].filter(Boolean).join(" · ")}
                            </p>
                            {hero.playstyle && <p>{hero.playstyle}</p>}
                            <ul className="tags">
                                {hero.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
                            </ul>
                        </div>
                    </header>

                    <section>
                        <div className="section-header">
                            <h2>Builds</h2>
                            <Link
                                to={`/heroes/${hero.id}/builds/new`}
                                className="button-link"
                            >
                                Nova build
                            </Link>
                        </div>
                        {builds.length === 0 && <p>Nenhuma build para este herói ainda.</p>}
                        <ul className="build-list">
                            {builds.map((build) => (
                                <li key={build.id} className="build-card">
                                    <h3>{build.name}</h3>
                                    {build.description && <p>{build.description}</p>}
                                    <ol className="build-items">
                                        {build.items.map((entry) => (
                                            <li key={entry.item.id}>{entry.item.name}</li>
                                        ))}
                                    </ol>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}
        </main>
    );
}
