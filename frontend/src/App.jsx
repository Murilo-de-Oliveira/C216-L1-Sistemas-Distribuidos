import { useEffect, useState } from "react";
import { GameForm } from "./components/GameForm";
import { GameList } from "./components/GameList";
import { createGame, listGames } from "./services/games";

export default function App() {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);
	const [saveError, setSaveError] = useState(null);

	useEffect(() => {
		let ignore = false;
		listGames()
			.then((data) => {
				if (!ignore) setGames(data);
			})
			.catch((e) => {
				if (!ignore) setLoadError(e.message);
			})
			.finally(() => {
				if (!ignore) setLoading(false);
			});
		return () => {
			ignore = true;
		};
	}, []);

	async function addGame(values) {
		setSaveError(null);
		try {
			const created = await createGame(values);
			setGames((current) => [created, ...current]);
			return true;
		} catch (e) {
			setSaveError(e.message);
			return false;
		}
	}

	return (
		<main className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-4 sm:p-6">
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
				<section aria-labelledby="games-heading" className="space-y-3">
					<h2 id="games-heading" className="text-xl font-semibold">
						Partidas cadastradas
					</h2>
					{loading && (
						<p role="status" className="text-slate-600">
							Carregando partidas...
						</p>
					)}
					{loadError && (
						<p role="alert" className="text-sm text-destructive">
							{loadError}
						</p>
					)}
					{!loading && !loadError && <GameList games={games} />}
				</section>

				<section aria-labelledby="form-heading" className="space-y-3">
					<h2 id="form-heading" className="text-xl font-semibold">
						Nova partida
					</h2>
					{saveError && (
						<p role="alert" className="text-sm text-destructive">
							{saveError}
						</p>
					)}
					<GameForm onAdd={addGame} />
				</section>
			</div>
		</main>
	);
}
