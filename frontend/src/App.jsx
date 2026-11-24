import { useState, useEffect } from "react";
import { listar, criar, atualizar, remover } from "./api.js";
import Header from "./components/Header.jsx";
import Filtros from "./components/Filtros.jsx";
import ListaFilmes from "./components/ListaFilmes.jsx";
import ModalFilme from "./components/ModalFilme.jsx";

const CHAVE_FILTROS = "cinetrack:filtros";
const FILTROS_PADRAO = { busca: "", status: "todos" };

function lerFiltros() {
  try {
    const filtros = JSON.parse(localStorage.getItem(CHAVE_FILTROS));
    return {
      busca: typeof filtros?.busca === "string" ? filtros.busca : FILTROS_PADRAO.busca,
      status: ["assistido", "assistindo", "quero"].includes(filtros?.status)
        ? filtros.status
        : FILTROS_PADRAO.status,
    };
  } catch {
    return FILTROS_PADRAO;
  }
}

export default function App() {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [inicial] = useState(lerFiltros);
  const [status, setStatus] = useState(() => inicial.status);
  const [busca, setBusca] = useState(() => inicial.busca);
  // null: fechado; {}: novo; com id: edição
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    listar()
      .then((dados) => setFilmes(dados))
      .catch((erro) => setErro(erro.message))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    document.title = `CineTrack (${filmes.length})`;
  }, [filmes.length]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_FILTROS, JSON.stringify({ busca, status }));
    } catch {}
  }, [busca, status]);

  // Erros sobem para o ModalFilme, que os mostra sem fechar
  async function salvar(filme) {
    if (filme.id) {
      const at = await atualizar(filme.id, filme);
      setFilmes((fs) => fs.map((f) => (f.id === at.id ? at : f)));
    } else {
      const novo = await criar(filme);
      setFilmes((fs) => [...fs, novo]);
    }
    setEditando(null);
  }

  async function removerFilme(id) {
    if (!confirm("Remover este filme?")) return;
    try {
      await remover(id);
      setFilmes((fs) => fs.filter((f) => f.id !== id));
    } catch (e) {
      alert(`Não foi possível remover: ${e.message}`);
    }
  }

  const visiveis = filmes
    .filter((filme) => status === "todos" || filme.status === status)
    .filter((filme) =>
      filme.titulo.toLowerCase().includes(busca.toLowerCase()));

  let conteudo;
  if (carregando) {
    conteudo = <p>Carregando...</p>;
  } else if (erro) {
    conteudo = <p className="erro">Erro: {erro}</p>;
  } else {
    conteudo = (
      <ListaFilmes
        filmes={visiveis}
        aoEditar={setEditando}
        aoRemover={removerFilme}
      />
    );
  }

  return (
    <>
      <Header
        busca={busca}
        aoBuscar={setBusca}
        aoAdicionar={() => setEditando({})}
      />
      <Filtros ativo={status} aoMudar={setStatus} />
      <p>Exibindo {visiveis.length} de {filmes.length} filmes</p>
      <main>{conteudo}</main>
      {editando !== null && (
        <ModalFilme
          filme={editando}
          aoSalvar={salvar}
          aoFechar={() => setEditando(null)}
        />
      )}
    </>
  );
}
