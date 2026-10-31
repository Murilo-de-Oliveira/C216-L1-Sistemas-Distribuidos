import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import FinalPosition from "./FinalPosition";

const POSITION = "1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0"

export function GameList({ games, onSelect }) {
    if (games.length === 0) {
        return <p className="text-slate-600">Nenhuma partida cadastrada</p>
    }

    return (
        <div className="@container">
            <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @3xl:grid-cols-3">
                {games.map((game) => (
                    <button type="button" onClick={() => onSelect(game.id)}>
                        <Card key={games.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{game.title}</CardTitle>
                                <CardDescription>{game.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FinalPosition pgn={POSITION} />
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" variant="secondary">BADGE</Badge>
                            </CardFooter>
                        </Card>
                    </button>
                ))}
            </div>
        </div>
    );
}
