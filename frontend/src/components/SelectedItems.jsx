
export default function SelectedItems({ items, onMove, onRemove }) {
    if (items.length === 0) {
        return <p>Nenhum item escolhido ainda.</p>;
    }

    return (
        <ol className="selected-list">
            {items.map((item, index) => (
                <li key={item.id} className="selected-item">
                    <span className="selected-name">{item.name}</span>
                    <span className="selected-actions">
                        <button
                            type="button"
                            aria-label={`Mover ${item.name} para cima`}
                            disabled={index === 0}
                            onClick={() => onMove(index, -1)}
                        >
                            ↑
                        </button>
                        <button
                            type="button"
                            aria-label={`Mover ${item.name} para baixo`}
                            disabled={index === items.length - 1}
                            onClick={() => onMove(index, 1)}
                        >
                            ↓
                        </button>
                        <button
                            type="button"
                            aria-label={`Remover ${item.name}`}
                            onClick={() => onRemove(item.id)}
                        >
                            ✕
                        </button>
                    </span>
                </li>
            ))}
        </ol>
    );
}
