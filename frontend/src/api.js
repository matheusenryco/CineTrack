// src/api.js
const BASE = "http://localhost:3000";

async function pedir(caminho, opcoes = {}) {
  let r;
  try {
    r = await fetch(BASE + caminho, {
      headers: { "Content-Type": "application/json" },
      ...opcoes,
    });
  } catch {
    throw new Error("Não foi possível conectar à API. O backend está rodando?");
  }
  if (!r.ok) {
    // 400 traz { erros: [...] }; 404 traz { erro: "..." }
    const corpo = await r.json().catch(() => ({}));
    const erro = new Error(corpo.erro ?? `HTTP ${r.status}`);
    erro.erros = corpo.erros;
    throw erro;
  }
  return r.status === 204 ? null : r.json();
}

export const listar = () => pedir("/filmes");
export const criar = (f) =>
  pedir("/filmes", { method: "POST", body: JSON.stringify(f) });
export const atualizar = (id, f) =>
  pedir(`/filmes/${id}`, { method: "PUT", body: JSON.stringify(f) });
export const remover = (id) =>
  pedir(`/filmes/${id}`, { method: "DELETE" });
