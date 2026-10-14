export default function Header({ busca, aoBuscar, aoAdicionar }) {
  return (
    <header>
      <h1>CineTrack</h1>
      <input
        type="search"
        aria-label="Buscar filme"
        placeholder="Buscar filme"
        value={busca}
        onChange={(e) => aoBuscar(e.target.value)}
      />
      <button type="button" onClick={aoAdicionar}>
        <span className="btn-curto">+</span>
        <span className="btn-longo">+ Adicionar</span>
      </button>
    </header>
  );
}
