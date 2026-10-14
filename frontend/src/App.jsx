import { filmesIniciais } from "./data/filmes.js";
import Header from "./components/Header.jsx";
import Filtros from "./components/Filtros.jsx";
import ListaFilmes from "./components/ListaFilmes.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Filtros />
      <ListaFilmes filmes={filmesIniciais} />
    </>
  );
}
