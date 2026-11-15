import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	COLOR_LABELS,
	ERROR_TAG_LABELS,
	formatPlayedAt,
	RESULT_BADGE_CLASSES,
	RESULT_LABELS,
	TIME_CONTROL_LABELS,
} from "./const";
import FinalPosition from "./FinalPosition";

export function GameList({ games }) {
	if (games.length === 0) {
		return <p className="text-slate-600">Nenhuma partida cadastrada.</p>;
	}

	return (
		<div className="@container">
			<ul className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @3xl:grid-cols-3">
				{games.map((game) => (
					<li key={game.id} className="min-w-0">
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="truncate text-xl">{game.title}</CardTitle>
								<CardDescription>
									{formatPlayedAt(game.played_at)} · {COLOR_LABELS[game.color]}{" "}
									· {TIME_CONTROL_LABELS[game.time_control]}
								</CardDescription>
							</CardHeader>

							{game.pgn && (
								<CardContent>
									<FinalPosition pgn={game.pgn} />
									{(game.opening || game.opponent_rating) && (
										<p className="text-sm text-slate-600">
											{game.opening}
											{game.opening && game.opponent_rating ? " · " : ""}
											{game.opponent_rating &&
												`Oponente: ${game.opponent_rating}`}
										</p>
									)}
									{game.notes && (
										<p className="text-sm text-slate-500 line-clamp-2">
											{game.notes}
										</p>
									)}
								</CardContent>
							)}

							<CardFooter>
								<div className="flex flex-wrap gap-1">
									<Badge
										className={RESULT_BADGE_CLASSES[game.result]}
										variant="secondary"
									>
										{RESULT_LABELS[game.result]}
									</Badge>
									{game.error_tags.map((tag) => (
										<Badge key={tag} variant="outline">
											{ERROR_TAG_LABELS[tag] ?? tag}
										</Badge>
									))}
								</div>
							</CardFooter>
						</Card>
					</li>
				))}
			</ul>
		</div>
	);
}
