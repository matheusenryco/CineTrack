import { filmesIniciais } from "./data/filmes.js";

// Promise que conclui após ms
function esperar(ms) {
  return new Promise((ok) => setTimeout(ok, ms));
}

export async function listar() {
  await esperar(500); // simula a rede
  return filmesIniciais;
}
