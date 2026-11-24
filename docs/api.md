# API do CineTrack

API REST do backend em `backend/server.js` (Node.js + Express). Os dados ficam em `backend/data/filmes.json`.

- **URL base:** `http://localhost:3000` (a porta vem de `PORT` no `.env`)
- **Formato:** JSON nos corpos de requisição e resposta. Envie `Content-Type: application/json` no `POST` e no `PUT`.
- **CORS:** liberado para qualquer origem.

## O filme

```json
{
  "id": 1,
  "titulo": "A Origem",
  "ano": 2010,
  "genero": "Ficção científica",
  "nota": 5,
  "status": "assistido",
  "comentario": "Um sonho dentro de outro sonho.",
  "poster": "img/a-origem.jpg"
}
```

| Campo | Tipo | Regra |
|-------|------|-------|
| `id` | inteiro | Gerado pelo servidor (maior `id` + 1). Se vier no corpo, é ignorado. |
| `titulo` | texto | Obrigatório, não pode ser só espaços. |
| `ano` | inteiro | Obrigatório, de 1888 a 2030. |
| `nota` | inteiro | Obrigatória, de 1 a 5. |
| `status` | texto | Obrigatório: `assistido`, `assistindo` ou `quero`. |
| `genero`, `comentario`, `poster` | texto | Opcionais, gravados como vierem. |

## Erros

O `POST` e o `PUT` validam o corpo com as regras acima e devolvem **todos** os problemas de uma vez:

```json
HTTP 400
{ "erros": ["nota deve estar entre 1 e 5", "status deve ser assistido, assistindo ou quero"] }
```

| Mensagem | Quando |
|----------|--------|
| `titulo é obrigatório` | `titulo` ausente, vazio, só com espaços ou não é texto |
| `ano deve estar entre 1888 e 2030` | `ano` ausente, fora da faixa ou não é inteiro (`"2010"` em texto também falha) |
| `nota deve estar entre 1 e 5` | `nota` ausente, fora da faixa ou não é inteiro |
| `status deve ser assistido, assistindo ou quero` | qualquer outro valor de `status` |

Um `id` que não existe devolve `404` com uma mensagem só: `{ "erro": "Filme não encontrado" }`.

Corpo com JSON malformado também devolve `400`, mas quem responde é o `express.json()`, com uma página de
erro em HTML, sem a lista `erros`.

## Rotas

### `GET /`: verificação de que a API está no ar

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| GET | `/` | nenhum | 200 | `{ "ola": "CineTrack" }` |

### `GET /filmes`: lista os filmes

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| GET | `/filmes` | query opcional `status` (`assistido`, `assistindo`, `quero`) e `q` (trecho do título, sem diferenciar maiúsculas); os dois combinam | 200 | Lista de filmes, possivelmente vazia (um `status` desconhecido devolve `[]`) |

Exemplo: `GET /filmes?status=quero&q=inter` devolve só "Interestelar".

### `GET /filmes/:id`: um filme

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| GET | `/filmes/:id` | `id` na URL | 200 | O filme |
| | | | 404 | `{ "erro": "Filme não encontrado" }` (inclui `id` não numérico) |

### `POST /filmes`: cria um filme

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| POST | `/filmes` | corpo: filme em JSON, sem `id` | 201 | O filme criado, já com `id` |
| | | | 400 | `{ "erros": [...] }`, com todos os campos inválidos |

```bash
curl -X POST http://localhost:3000/filmes \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Tenet","ano":2020,"genero":"Ação","nota":4,"status":"quero"}'
```

### `PUT /filmes/:id`: atualiza um filme

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| PUT | `/filmes/:id` | `id` na URL; corpo: filme **completo** em JSON, com as mesmas regras do `POST` | 200 | O filme atualizado (o `id` da URL é mantido) |
| | | | 400 | `{ "erros": [...] }`. Um corpo parcial, como `{ "nota": 5 }`, falha pelos campos que faltam |
| | | | 404 | `{ "erro": "Filme não encontrado" }` |

O corpo é validado antes de procurar o filme: um `PUT` inválido para um `id` inexistente devolve `400`.
Campos opcionais que não vierem no corpo mantêm o valor anterior.

### `DELETE /filmes/:id`: remove um filme

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| DELETE | `/filmes/:id` | `id` na URL | 204 | Sem corpo |
| | | | 404 | `{ "erro": "Filme não encontrado" }` (também ao remover o mesmo `id` duas vezes) |

### `GET /stats`: resumo da coleção

| Método | Caminho | Parâmetros / corpo | Código | Resposta |
|--------|---------|--------------------|--------|----------|
| GET | `/stats` | nenhum | 200 | `{ "total": 6, "porStatus": { "assistido": 3, "assistindo": 1, "quero": 2 }, "mediaNotas": 4.5 }` |

`mediaNotas` tem uma casa decimal e vale `0` com a lista vazia. Status sem nenhum filme não aparecem em
`porStatus`. O exemplo acima é o estado logo depois do `node seed.js`.
