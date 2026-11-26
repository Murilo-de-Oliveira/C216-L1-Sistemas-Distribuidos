import { useMemo, useState } from "react";

export default function ItemPicker({ items, selectedIds, onAdd, full }) {
    const [search, setSearch] = useState("");
    const [slot, setSlot] = useState("");
    const [tier, setTier] = useState("");

    const slots = useMemo(
        () => [...new Set(items.map((i) => i.item_slot_type))].filter(Boolean),
        [items],
    );
    const tiers = useMemo(
        () =>
            [...new Set(items.map((i) => i.item_tier))]
                .filter((t) => t !== null && t !== undefined)
                .sort((a, b) => a - b),
        [items],
    );

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase();
        return items
            .filter((i) => !term || i.name.toLowerCase().includes(term))
            .filter((i) => !slot || i.item_slot_type === slot)
            .filter((i) => tier === "" || String(i.item_tier) === tier)
            .sort(
                (a, b) =>
                    (a.item_tier ?? 0) - (b.item_tier ?? 0) ||
                    (a.cost ?? 0) - (b.cost ?? 0) ||
                    a.name.localeCompare(b.name),
            );
    }, [items, search, slot, tier]);

    return (
        <div>
            <div className="picker-filters">
                <input
                    type="search"
                    placeholder="Buscar item..."
                    aria-label="Buscar item"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    aria-label="Filtrar por categoria"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                >
                    <option value="">Todas as categorias</option>
                    {slots.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <select
                    aria-label="Filtrar por tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                >
                    <option value="">Todos os tiers</option>
                    {tiers.map((t) => (
                        <option key={t} value={String(t)}>
                            Tier {t}
                        </option>
                    ))}
                </select>
            </div>

            {visible.length === 0 && <p>Nenhum item encontrado.</p>}

            <ul className="picker-list">
                {visible.map((item) => {
                    const selected = selectedIds.includes(item.id);
                    return (
                        <li key={item.id}>
                            <button
                                type="button"
                                className="picker-item"
                                disabled={selected || full}
                                onClick={() => onAdd(item.id)}
                            >
                                {item.shop_image && (
                                    <img src={item.shop_image} alt="" width="36" height="36" />
                                )}
                                <span className="picker-name">{item.name}</span>
                                <span className="picker-meta">
                                    {selected
                                        ? "Adicionado"
                                        : `T${item.item_tier} · ${item.cost}`}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
