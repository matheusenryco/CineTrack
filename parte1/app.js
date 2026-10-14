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

// Validação pura: recebe um filme e devolve o resultado, sem tocar o DOM
function validarFilme(filme) {
    const erros = [];
    if (!filme.titulo) erros.push("Título obrigatório");
    if (filme.ano < 1888 || filme.ano > 2030) erros.push("Ano inválido");
    return { valido: erros.length === 0, erros };
}

// Próximo id: o maior id existente mais 1 (o 0 cobre a lista vazia)
const gerarId = (itens) => Math.max(0, ...itens.map((f) => f.id)) + 1;

// Cria um elemento com texto; textContent nunca interpreta HTML (evita XSS)
function criarElemento(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
}

function criarCard(filme) {
    const card = criarElemento("article", "card");
    card.dataset.id = filme.id;

    const poster = document.createElement("img");
    if (filme.poster) poster.src = filme.poster;
    poster.alt = `Poster de ${filme.titulo}`;
    poster.width = 300;
    poster.height = 450;

    const titulo = criarElemento("h2", "", filme.titulo);
    const info = criarElemento("p", "", `${filme.ano} · ${filme.genero}`);
    const nota = criarElemento("p", "", `Nota: ${estrelas(filme.nota)}`);
    const badge = criarElemento("span", `badge ${filme.status}`, rotuloStatus(filme.status));

    const acoes = criarElemento("div", "acoes");
    const editar = criarElemento("button", "btn-editar", "Editar");
    editar.type = "button";
    const remover = criarElemento("button", "btn-remover", "Remover");
    remover.type = "button";
    acoes.append(editar, remover);

    card.append(poster, titulo, info, nota, badge, acoes);
    return card;
}

// Monta os cards fora da árvore e os anexa de uma só vez
function renderizarCards(itens) {
    const frag = document.createDocumentFragment();
    itens.forEach((filme) => frag.appendChild(criarCard(filme)));
    document.querySelector("#lista").replaceChildren(frag);
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

// Modal: um único formulário para adicionar (editandoId = null) e editar
let editandoId = null;
const modal = document.querySelector("#modal");
const form = document.querySelector("#form-filme");
const abrir = () => { modal.hidden = false; };
const fechar = () => { modal.hidden = true; };

document.querySelector("header button").addEventListener("click", () => {
    editandoId = null;
    form.reset();
    abrir();
});

document.querySelector("#btn-cancelar").addEventListener("click", fechar);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) fechar();
});

// Editar por delegação: preenche o formulário com o filme do card clicado
lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-editar");
    if (!botao) return;
    const card = botao.closest(".card");
    editandoId = Number(card.dataset.id);
    const filme = filmes.find((f) => f.id === editandoId);
    const campos = ["titulo", "ano", "genero", "poster", "status", "nota", "comentario"];
    for (const campo of campos) {
        form.elements[campo].value = filme[campo] ?? "";
    }
    abrir();
});

// Salvar: valida e então adiciona ou edita sem mutar o array
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    dados.ano = Number(dados.ano); // vem string
    dados.nota = Number(dados.nota);

    const { valido, erros } = validarFilme(dados);
    if (!valido) {
        alert(erros.join("\n"));
        return;
    }

    if (editandoId !== null) {
        filmes = filmes.map((f) =>
            f.id === editandoId ? { ...f, ...dados } : f);
    } else {
        filmes = [...filmes, { id: gerarId(filmes), ...dados }];
    }

    editandoId = null;
    renderizarCards(filmes);
    fechar();
});
