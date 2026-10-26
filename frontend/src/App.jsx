import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";

import FinalPosition from "./components/FinalPosition";

const POSITION = `1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8.
Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15.
Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21.
Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`

export default function App() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Chess Frontend</h1>

            <CardList></CardList>
        </main>
    );
}


function CardList() {
    const notes = [
        { id: 1, title: "Title1", date: "01/01/2026", position: POSITION },
        { id: 2, title: "Title2", date: "02/01/2026", position: POSITION },
        { id: 3, title: "Title3", date: "03/01/2026", position: POSITION },
        { id: 4, title: "Title4", date: "04/01/2026", position: POSITION },
        { id: 5, title: "Title5", date: "05/01/2026", position: POSITION },
        { id: 6, title: "Title6", date: "06/01/2026", position: POSITION },
        { id: 7, title: "Title7", date: "07/01/2026", position: POSITION },
        { id: 8, title: "Title8", date: "08/01/2026", position: POSITION },
        { id: 9, title: "Title9", date: "09/01/2026", position: POSITION },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div style={{ "display": "flex", "justify-content": "center", "align-items": "center" }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de partidas</h2>
            </div>

            {/*Container grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <Card key={note.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{note.title}</CardTitle>
                            <CardDescription>{note.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FinalPosition pgn={POSITION} />
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" variant="secondary">BADGE</Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
