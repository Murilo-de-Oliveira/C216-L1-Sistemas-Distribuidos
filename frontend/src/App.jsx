import { useState } from "react";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Chess Frontend</h1>
        </main>
    );
}