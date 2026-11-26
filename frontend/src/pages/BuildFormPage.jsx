import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { createBuild } from "../api/builds.js";
import { fetchHero } from "../api/heroes.js";
import { fetchItems } from "../api/items.js";
import ItemPicker from "../components/ItemPicker.jsx";
import SelectedItems from "../components/SelectedItems.jsx";

const MAX_ITEMS = 12; // o backend ainda não limita; ajuste conforme a regra do jogo

export default function BuildFormPage() {
    const { heroId } = useParams();
    const navigate = useNavigate();

    const [hero, setHero] = useState(null);
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | error | ready
    const [loadError, setLoadError] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        setStatus("loading");

        Promise.all([
            fetchHero(heroId, controller.signal),
            fetchItems(controller.signal),
        ])
            .then(([heroData, itemsData]) => {
                setHero(heroData);
                setItems(itemsData);
                setStatus("ready");
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setLoadError(
                    err.status === 404 ? "Herói não encontrado." : err.message,
                );
                setStatus("error");
            });

        return () => controller.abort();
    }, [heroId]);

    const itemsById = useMemo(
        () => new Map(items.map((item) => [item.id, item])),
        [items],
    );
    const selectedItems = selectedIds.map((id) => itemsById.get(id));
    const full = selectedIds.length >= MAX_ITEMS;

    const addItem = (id) =>
        setSelectedIds((ids) =>
            ids.includes(id) || ids.length >= MAX_ITEMS ? ids : [...ids, id],
        );

    const removeItem = (id) =>
        setSelectedIds((ids) => ids.filter((current) => current !== id));

    const moveItem = (index, delta) =>
        setSelectedIds((ids) => {
            const target = index + delta;
            if (target < 0 || target >= ids.length) return ids;
            const next = [...ids];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");

        if (!name.trim()) {
            setSubmitError("Dê um nome para a build.");
            return;
        }
        if (selectedIds.length === 0) {
            setSubmitError("Escolha ao menos 1 item.");
            return;
        }

        setSubmitting(true);
        try {
            await createBuild({
                name: name.trim(),
                description: description.trim() || null,
                hero_id: Number(heroId),
                items: selectedIds,
            });
            navigate(`/heroes/${heroId}`);
        } catch (err) {
            setSubmitError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <main className="page">
            <Link to={`/heroes/${heroId}`} className="back-link">
                ← {hero ? hero.name : "Herói"}
            </Link>

            {status === "loading" && <p>Carregando...</p>}
            {status === "error" && <p role="alert">{loadError}</p>}

            {status === "ready" && (
                <form className="build-form" onSubmit={handleSubmit}>
                    <h1>Nova build para {hero.name}</h1>

                    <label htmlFor="build-name">Nome</label>
                    <input
                        id="build-name"
                        value={name}
                        maxLength={80}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="build-description">Descrição (opcional)</label>
                    <textarea
                        id="build-description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="form-columns">
                        <section>
                            <h2>Itens</h2>
                            <ItemPicker
                                items={items}
                                selectedIds={selectedIds}
                                onAdd={addItem}
                                full={full}
                            />
                        </section>

                        <section>
                            <h2>
                                Ordem de compra ({selectedIds.length}/{MAX_ITEMS})
                            </h2>
                            <SelectedItems
                                items={selectedItems}
                                onMove={moveItem}
                                onRemove={removeItem}
                            />
                        </section>
                    </div>

                    {submitError && <p role="alert">{submitError}</p>}

                    <button type="submit" className="primary" disabled={submitting}>
                        {submitting ? "Salvando..." : "Salvar build"}
                    </button>
                </form>
            )}
        </main>
    );
}
