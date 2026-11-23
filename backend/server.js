const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const ARQUIVO = path.join(__dirname, "data", "filmes.json");

function lerFilmes() {
  return JSON.parse(fs.readFileSync(ARQUIVO, "utf8"));
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

app.listen(3000, () =>
  console.log("API na porta 3000"));
