import { Route, Routes } from "react-router";
import BuildFormPage from "./pages/BuildFormPage.jsx";
import HeroPage from "./pages/HeroPage.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/heroes/:heroId" element={<HeroPage />} />
      <Route path="/heroes/:heroId/builds/new" element={<BuildFormPage />} />
      <Route
        path="*"
        element={<p className="page">Página não encontrada.</p>}
      />
    </Routes>
  );
}
