export default function Header() {
  return (
    <header>
      <h1>CineTrack</h1>
      <input type="search" aria-label="Buscar filme" placeholder="Buscar filme" />
      <button type="button">
        <span className="btn-curto">+</span>
        <span className="btn-longo">+ Adicionar</span>
      </button>
    </header>
  );
}
