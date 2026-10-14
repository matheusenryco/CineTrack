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

const filmesIniciais = [
    { id: 1, titulo: "A Origem", ano: 2010, genero: "Ficção científica", poster: "img/a-origem.jpg", nota: 5, status: "assistido", comentario: "Um sonho dentro de outro sonho." },
    { id: 2, titulo: "Parasita", ano: 2019, genero: "Suspense", poster: "img/parasite.jpg", nota: 4, status: "assistido", comentario: "Crítica social afiada e cheia de reviravoltas." },
    { id: 3, titulo: "O Auto da Compadecida", ano: 2000, genero: "Comédia", poster: "img/a-dogs-will.jpg", nota: 5, status: "assistido", comentario: "Clássico do humor brasileiro." },
    { id: 4, titulo: "Duna: Parte Dois", ano: 2024, genero: "Ficção científica", poster: "img/dune-part-two.jpg", nota: 4, status: "assistindo", comentario: "Visual impressionante, vendo aos poucos." },
    { id: 5, titulo: "Interestelar", ano: 2014, genero: "Ficção científica", poster: "img/interstelar.jpg", nota: 5, status: "quero", comentario: "Dizem que a trilha sonora é incrível." },
    { id: 6, titulo: "Cidade de Deus", ano: 2002, genero: "Drama", poster: "img/city-of-god.jpg", nota: 4, status: "quero", comentario: "Está na lista há muito tempo." }
];

function validarFilme(filme) {
    const erros = [];
    if (!filme.titulo) erros.push("Título obrigatório");
    if (!Number.isInteger(filme.ano) || filme.ano < 1888 || filme.ano > 2030) {
        erros.push("Ano inválido (entre 1888 e 2030)");
    }
    if (!filme.genero) erros.push("Gênero obrigatório");
    if (!["assistido", "assistindo", "quero"].includes(filme.status)) {
        erros.push("Status inválido");
    }
    if (!Number.isInteger(filme.nota) || filme.nota < 1 || filme.nota > 5) {
        erros.push("Nota deve ser um número inteiro de 1 a 5");
    }
    return { valido: erros.length === 0, erros };
}

// Imagem usada quando o filme não tem pôster (ou a URL não carrega)
const POSTER_PADRAO = "data:image/svg+xml;utf8,"
    + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">'
        + '<rect width="300" height="450" fill="#9aa0a6"/>'
        + '<text x="150" y="225" font-family="sans-serif" font-size="24" fill="#ffffff" '
        + 'text-anchor="middle">Sem pôster</text></svg>');

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
    poster.src = filme.poster || POSTER_PADRAO;
    poster.addEventListener("error", () => { poster.src = POSTER_PADRAO; }, { once: true });
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

function renderizarCards(itens) {
    const frag = document.createDocumentFragment();
    itens.forEach((filme) => frag.appendChild(criarCard(filme)));
    document.querySelector("#lista").replaceChildren(frag);
}

const CHAVE = "cinetrack:filmes";

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(filmes));
}

function carregar() {
    const txt = localStorage.getItem(CHAVE);
    return txt ? JSON.parse(txt) : [...filmesIniciais];
}

function debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// Lista de trabalho: filmesIniciais continua intacta, as ações trocam esta cópia
let filmes = carregar();
let termoAtual = "";
let statusAtual = "todos";
let ordemAtual = "titulo";

const lista = document.querySelector("#lista");
const nav = document.querySelector("nav");
const busca = document.querySelector("header input");
const ordenar = document.querySelector("#ordenar");

function aplicarFiltros(lista, opcoes) {
    const termo = opcoes.termo.toLowerCase();
    return lista
        .filter((f) => f.titulo.toLowerCase().includes(termo))
        .filter((f) => opcoes.status === "todos"
            || f.status === opcoes.status);
}

function ordenarFilmes(itens, criterio) {
    const porTitulo = (a, b) => a.titulo.localeCompare(b.titulo, "pt-BR");
    const comparadores = {
        titulo: porTitulo,
        ano: (a, b) => b.ano - a.ano || porTitulo(a, b),
        nota: (a, b) => b.nota - a.nota || porTitulo(a, b)
    };
    return [...itens].sort(comparadores[criterio]);
}

function atualizar() {
    const filtrados = aplicarFiltros(filmes,
        { termo: termoAtual, status: statusAtual });
    renderizarCards(ordenarFilmes(filtrados, ordemAtual));
}

// Opcional: busca o pôster real na TMDB para filmes cadastrados sem pôster.
// Token de leitura (v4) da TMDB em TMDB_KEY; vazio, nada é buscado.
const TMDB_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MWZhZDAyZjg5ZmNhZDQzZTE2ZDRmMmIxNzVkMWI3ZCIsIm5iZiI6MTc5MTk4OTA1Mi4yNzksInN1YiI6IjZhY2Y5NTNjNjEzZWFmZjIwNTA3MmZlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1YriLA2aa8gcFLLrgqyOmNdySnIc52iWZ5eb7u4px7Y";

async function buscarPoster(filme) {
    const params = new URLSearchParams({
        query: filme.titulo,
        year: filme.ano,
        language: "pt-BR"
    });
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
        headers: { Authorization: `Bearer ${TMDB_KEY}` }
    });
    if (!resp.ok) throw new Error(`TMDB respondeu ${resp.status}`);
    const dados = await resp.json();
    const caminho = dados.results[0]?.poster_path;
    return caminho ? `https://image.tmdb.org/t/p/w500${caminho}` : "";
}

async function preencherPosters() {
    if (!TMDB_KEY) return;
    for (const filme of filmes.filter((f) => !f.poster)) {
        try {
            const poster = await buscarPoster(filme);
            if (!poster) continue;
            filmes = filmes.map((f) => f.id === filme.id ? { ...f, poster } : f);
            salvar();
            atualizar();
        } catch (erro) {
            console.error(`Pôster de "${filme.titulo}" não carregou:`, erro);
        }
    }
}

const aoDigitar = (e) => {
    termoAtual = e.target.value;
    atualizar();
};

busca.addEventListener("input", debounce(aoDigitar, 300));

ordenar.addEventListener("change", (e) => {
    ordemAtual = e.target.value;
    atualizar();
});

atualizar();
preencherPosters();

document.querySelector("footer small").textContent =
    `CineTrack © 2026 · ${filmesIniciais.length} filmes cadastrados`;

lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-remover");
    if (!botao) return;
    if (!confirm("Remover este filme?")) return;
    const card = botao.closest(".card");
    const id = Number(card.dataset.id);
    filmes = filmes.filter((f) => f.id !== id);
    salvar();
    atualizar();
});

nav.addEventListener("click", (e) => {
    const botao = e.target.closest("button");
    if (!botao) return;
    nav.querySelector(".ativo")
        .classList.remove("ativo");
    botao.classList.add("ativo");
    statusAtual = botao.dataset.status;
    atualizar();
});

// Modal: um único formulário para adicionar (editandoId = null) e editar
let editandoId = null;
const modal = document.querySelector("#modal");
const form = document.querySelector("#form-filme");
const areaErros = document.querySelector("#erros-form");
const mostrarErros = (erros) => {
    areaErros.replaceChildren(...erros.map((msg) => criarElemento("p", "", msg)));
    areaErros.hidden = erros.length === 0;
};
const abrir = () => { mostrarErros([]); modal.hidden = false; };
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

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    dados.ano = Number(dados.ano); // vem string
    dados.nota = Number(dados.nota);
    dados.titulo = dados.titulo.trim(); // só espaços não vale
    dados.genero = dados.genero.trim();

    const { valido, erros } = validarFilme(dados);
    if (!valido) {
        mostrarErros(erros);
        return;
    }

    if (editandoId !== null) {
        filmes = filmes.map((f) =>
            f.id === editandoId ? { ...f, ...dados } : f);
    } else {
        filmes = [...filmes, { id: gerarId(filmes), ...dados }];
    }

    editandoId = null;
    salvar();
    atualizar();
    fechar();
    preencherPosters();
});
