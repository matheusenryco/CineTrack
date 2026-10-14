import Estrelas from "./Estrelas.jsx";
import Badge from "./Badge.jsx";

export default function CardFilme({ filme, aoEditar, aoRemover }) {
  return (
    <article className="card">
      <img
        src={filme.poster || undefined}
        alt={`Poster de ${filme.titulo}`}
        width={300}
        height={450}
      />
      <h2>{filme.titulo}</h2>
      <p>{filme.ano} · {filme.genero}</p>
      <p>Nota: <Estrelas nota={filme.nota} /></p>
      <Badge status={filme.status} />
      <div className="acoes">
        <button
          type="button"
          className="btn-editar"
          onClick={() => aoEditar(filme)}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn-remover"
          onClick={() => aoRemover(filme.id)}
        >
          Remover
        </button>
      </div>
    </article>
  );
}
