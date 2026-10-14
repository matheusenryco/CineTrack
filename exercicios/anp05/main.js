import { filmesIniciais } from "./filmes.js";
import { mediaNotas, contagemPorStatus, ordenarPorNota } from "./estatisticas.js";

console.log("Média das notas:", mediaNotas(filmesIniciais));
console.log("Contagem por status:", contagemPorStatus(filmesIniciais));

const ordenados = ordenarPorNota(filmesIniciais);
console.log("Ordenados por nota:", ordenados.map((f) => `${f.titulo} (${f.nota})`));

// Prova de que a lista original não foi mutada
console.log("Original depois de ordenar:", filmesIniciais.map((f) => `${f.titulo} (${f.nota})`));
console.log("É a mesma lista?", ordenados === filmesIniciais);
