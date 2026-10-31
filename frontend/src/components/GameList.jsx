import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatPlayedAt, RESULT_BADGE_CLASSES, RESULT_LABELS } from "./const";
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
                                <CardDescription>{formatPlayedAt(game.played_at)}</CardDescription>
                            </CardHeader>

                            {game.pgn && (
                                <CardContent>
                                    <FinalPosition pgn={game.pgn} />
                                </CardContent>
                            )}

                            <CardFooter>
                                <Badge className={RESULT_BADGE_CLASSES[game.result]} variant="secondary">
                                    {RESULT_LABELS[game.result]}
                                </Badge>
                            </CardFooter>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}