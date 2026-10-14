// Funções puras: só recebem valores e devolvem valores (sem DOM, sem console).
function rotuloStatus(status) {
    if (status === "assistido") return "Assistido";
    if (status === "assistindo") return "Assistindo";
    if (status === "quero") return "Quero assistir";
    return status;
}

const estrelas = (nota) => {
    let resultado = "";
    for (let i = 1; i <= 5; i++) {
        resultado += i <= nota ? "★" : "☆";
    }
    return resultado;
};

// Dados de exemplo
const filmesIniciais = [
    { id: 1, titulo: "A Origem", ano: 2010, genero: "Ficção científica", poster: "img/a-origem.jpg", nota: 5, status: "assistido", comentario: "Um sonho dentro de outro sonho." },
    { id: 2, titulo: "Parasita", ano: 2019, genero: "Suspense", poster: "img/parasite.jpg", nota: 4, status: "assistido", comentario: "Crítica social afiada e cheia de reviravoltas." },
    { id: 3, titulo: "O Auto da Compadecida", ano: 2000, genero: "Comédia", poster: "img/a-dogs-will.jpg", nota: 5, status: "assistido", comentario: "Clássico do humor brasileiro." },
    { id: 4, titulo: "Duna: Parte Dois", ano: 2024, genero: "Ficção científica", poster: "img/dune-part-two.jpg", nota: 4, status: "assistindo", comentario: "Visual impressionante, vendo aos poucos." },
    { id: 5, titulo: "Interestelar", ano: 2014, genero: "Ficção científica", poster: "img/interstelar.jpg", nota: 5, status: "quero", comentario: "Dizem que a trilha sonora é incrível." },
    { id: 6, titulo: "Cidade de Deus", ano: 2002, genero: "Drama", poster: "img/city-of-god.jpg", nota: 4, status: "quero", comentario: "Está na lista há muito tempo." }
];

// Monta o HTML de um card por filme e injeta tudo de uma vez
function renderizarCards(lista) {
    const html = lista.map((filme) => `
            <article class="card" data-id="${filme.id}">
                <img src="${filme.poster}" alt="Poster de ${filme.titulo}" width="300" height="450">
                <h2>${filme.titulo}</h2>
                <p>${filme.ano} · ${filme.genero}</p>
                <p>Nota: ${estrelas(filme.nota)}</p>
                <span class="badge ${filme.status}">${rotuloStatus(filme.status)}</span>
                <div class="acoes">
                    <button type="button" class="btn-editar">Editar</button>
                    <button type="button" class="btn-remover">Remover</button>
                </div>
            </article>`).join("");

    document.querySelector("#lista").innerHTML = html;
}

// Lista de trabalho: filmesIniciais continua intacta, as ações trocam esta cópia
let filmes = [...filmesIniciais];

const lista = document.querySelector("#lista");
const nav = document.querySelector("nav");

renderizarCards(filmes);

// Rodapé
document.querySelector("footer small").textContent =
    `CineTrack © 2026 · ${filmesIniciais.length} filmes cadastrados`;

// Remoção por delegação: um único listener cobre todos os botões Remover
lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-remover");
    if (!botao) return; // clicou em outra coisa
    if (!confirm("Remover este filme?")) return;
    const card = botao.closest(".card");
    const id = Number(card.dataset.id);
    filmes = filmes.filter((f) => f.id !== id);
    renderizarCards(filmes);
});

// Filtro por status por delegação
nav.addEventListener("click", (e) => {
    const botao = e.target.closest("button");
    if (!botao) return;
    nav.querySelector(".ativo")
        .classList.remove("ativo");
    botao.classList.add("ativo");
    const status = botao.dataset.status;
    renderizarCards(filmes.filter((f) =>
        status === "todos" || f.status === status));
});
