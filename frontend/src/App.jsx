import { useState } from "react";
import { GameForm } from "./components/GameForm";
import { GameList } from "./components/GameList";
import { initialGames } from "./seed";

export default function App() {
    const [games, setGames] = useState(initialGames);

    function addGame(values) {
        setGames((current) => [
            { id: crypto.randomUUID(), played_at: new Date().toISOString(), ...values },
            ...current,
        ]);
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-4 sm:p-6">
            <h1 className="text-3xl font-bold">Minhas partidas</h1>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <section aria-labelledby="games-heading" className="space-y-3">
                    <h2 id="games-heading" className="text-xl font-semibold">
                        Partidas cadastradas
                    </h2>
                    <GameList games={games} />
                </section>

                <section aria-labelledby="form-heading" className="space-y-3">
                    <h2 id="form-heading" className="text-xl font-semibold">
                        Nova partida
                    </h2>
                    <GameForm onAdd={addGame} />
                </section>
            </div>
        </main>
    );
}