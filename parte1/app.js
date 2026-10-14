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

// Teste no console
console.log(rotuloStatus("quero"), estrelas(3));

// Badge e nota do primeiro card vêm das funções
const badge = document.querySelector(".card .badge");
badge.textContent = rotuloStatus("assistido");

const nota = document.querySelector(".card p:nth-of-type(2)");
nota.textContent = `Nota: ${estrelas(5)}`;

// Rodapé
const TOTAL = 6;
document.querySelector("footer small").textContent =
    `CineTrack © 2026 · ${TOTAL} filmes cadastrados`;
