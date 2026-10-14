import { useState } from "react";

const VAZIO = {
  titulo: "",
  ano: "",
  genero: "",
  poster: "",
  status: "quero",
  nota: 3,
  comentario: "",
};

export default function ModalFilme({ filme, aoSalvar, aoFechar }) {
  const [dados, setDados] = useState({
    ...VAZIO,
    ...filme,
  });

  function atualizar(campo, valor) {
    setDados((anteriores) => ({
      ...anteriores,
      [campo]: valor,
    }));
  }

  function submeter(evento) {
    evento.preventDefault();
    aoSalvar({
      ...dados,
      ano: Number(dados.ano),
      nota: Number(dados.nota),
    });
  }

  return (
    <div id="modal">
      <div className="modal-conteudo">
        <h2>{filme.id ? "Editar filme" : "Adicionar filme"}</h2>
        <form id="form-filme" onSubmit={submeter}>
          <div className="campo">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={dados.titulo}
              onChange={(e) => atualizar("titulo", e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="ano">Ano</label>
            <input
              id="ano"
              type="number"
              min="1888"
              max="2030"
              value={dados.ano}
              onChange={(e) => atualizar("ano", e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="genero">Gênero</label>
            <input
              id="genero"
              type="text"
              value={dados.genero}
              onChange={(e) => atualizar("genero", e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="url-poster">URL do pôster</label>
            <input
              id="url-poster"
              type="text"
              value={dados.poster}
              onChange={(e) => atualizar("poster", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={dados.status}
              onChange={(e) => atualizar("status", e.target.value)}
            >
              <option value="quero">Quero assistir</option>
              <option value="assistindo">Assistindo</option>
              <option value="assistido">Assistido</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="nota">Nota (1 a 5)</label>
            <select
              id="nota"
              value={dados.nota}
              onChange={(e) => atualizar("nota", e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="comentario">Comentário</label>
            <textarea
              id="comentario"
              value={dados.comentario}
              onChange={(e) => atualizar("comentario", e.target.value)}
            />
          </div>

          <div className="acoes">
            <button type="button" onClick={aoFechar}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
