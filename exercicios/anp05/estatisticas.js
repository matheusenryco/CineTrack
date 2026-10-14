// Funções puras: só recebem valores e devolvem valores (sem DOM, sem console).

// Média das notas, arredondada para 1 casa decimal (lista vazia devolve 0)
export function mediaNotas(lista) {
    if (lista.length === 0) return 0;
    const soma = lista.reduce((acc, filme) => acc + filme.nota, 0);
    return Math.round((soma / lista.length) * 10) / 10;
}

// Conta quantos filmes há em cada status: { assistido: 3, assistindo: 1, quero: 2 }
export function contagemPorStatus(lista) {
    return lista.reduce((acc, filme) => {
        acc[filme.status] = (acc[filme.status] || 0) + 1;
        return acc;
    }, {});
}

// sort muda o array em que é chamado, então ordena uma cópia ([...lista])
export function ordenarPorNota(lista) {
    return [...lista].sort((a, b) => b.nota - a.nota);
}
