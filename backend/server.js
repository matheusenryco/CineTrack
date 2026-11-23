const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const ARQUIVO = path.join(__dirname, "data", "filmes.json");

function lerFilmes() {
  return JSON.parse(fs.readFileSync(ARQUIVO, "utf8"));
}

function salvarFilmes(lista) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(lista, null, 2));
}

app.get("/", (req, res) => {
  res.json({ ola: "CineTrack" });
});

app.get("/filmes", (req, res) => {
  let lista = lerFilmes();
  if (req.query.status)
    lista = lista.filter(f => f.status === req.query.status);
  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    lista = lista.filter(f => f.titulo.toLowerCase().includes(q));
  }
  res.json(lista);
});

app.get("/stats", (req, res) => {
  const lista = lerFilmes();
  const porStatus = lista.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});
  const notas = lista.filter(f => f.nota);
  const soma = notas.reduce((acc, f) => acc + f.nota, 0);
  const mediaNotas = notas.length ? Number((soma / notas.length).toFixed(1)) : 0;
  res.json({ total: lista.length, porStatus, mediaNotas });
});

app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const filme = lerFilmes().find(f => f.id === id);
  if (!filme) return res.status(404)
    .json({ erro: "Filme não encontrado" });
  res.json(filme);
});

app.post("/filmes", (req, res) => {
  const { titulo, ano } = req.body;
  if (!titulo || !ano)
    return res.status(400)
      .json({ erro: "titulo e ano são obrigatórios" });
  const lista = lerFilmes();
  const id = lista.reduce((m, f) => Math.max(m, f.id), 0) + 1;
  const novo = { ...req.body, id };
  lista.push(novo);
  salvarFilmes(lista);
  res.status(201).json(novo);
});

app.put("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const lista = lerFilmes();
  const i = lista.findIndex(f => f.id === id);
  if (i === -1) return res.status(404)
    .json({ erro: "Filme não encontrado" });
  lista[i] = { ...lista[i], ...req.body, id };
  salvarFilmes(lista);
  res.json(lista[i]);
});

app.delete("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const lista = lerFilmes();
  if (!lista.some(f => f.id === id)) return res.status(404)
    .json({ erro: "Filme não encontrado" });
  salvarFilmes(lista.filter(f => f.id !== id));
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`API na porta ${PORT}`));
