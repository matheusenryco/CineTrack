# ANP 01: HTTP de verdade no DevTools

Observei o ciclo requisição-resposta na aba Network do DevTools, abrindo o [MDN](https://developer.mozilla.org) e também uma busca dinâmica na Open Library.

## 1. Primeira requisição (documento)

Abri e recarreguei `https://developer.mozilla.org/en-US/`. A primeira requisição da lista foi o próprio documento HTML:

| Campo            | Valor observado                        |
|------------------|----------------------------------------|
| Método           | `GET`                                  |
| URL              | `https://developer.mozilla.org/en-US/` |
| Código de status | `200`                                  |

## 2. Recursos estáticos

Com a página carregada, anotei três requisições de recursos estáticos (aba Headers, Response Headers):

| Tipo       | Método | URL | Status | Content-Type |
|------------|--------|-----|--------|--------------|
| CSS        | `GET`  | `https://developer.mozilla.org/static/client/styles-global.ae8b92e1b0391d6b.css` | `200` | `text/css` |
| JavaScript | `GET`  | `https://developer.mozilla.org/static/client/runtime.9ed0e12ebe978c41.js` | `200` | `text/javascript` |
| Imagem     | `GET`  | `https://developer.mozilla.org/static/ssr/mdn_contributor.9e2a105f50828d5a.png` | `200` | `image/png` |

As três usam `GET`, o que faz sentido porque só estão lendo o arquivo. O `Content-Type` mostra o formato do que veio na resposta.

## 3. Provocando um 404

Editei a URL para um caminho que não existe:

`https://developer.mozilla.org/en-US/caminho-inexistente-cinetrack-404`

| Campo            | Página válida (`/en-US/`) | Caminho inexistente |
|------------------|---------------------------|---------------------|
| Método           | `GET`                     | `GET`               |
| Código de status | `200`                     | `404`               |
| Content-Type     | `text/html`               | `text/html`         |

O método e o `Content-Type` ficaram iguais. O que mudou foi o código de status: `200` quer dizer que o recurso foi encontrado, e `404` que o servidor não achou nada nesse caminho. A resposta ainda veio em HTML (a página de erro do MDN), mas o status deixa claro que deu errado.

## 4. Requisição de API (Fetch/XHR)

Filtrei por Fetch/XHR numa busca dinâmica e peguei esta chamada da Open Library:

| Campo        | Valor observado |
|--------------|-----------------|
| Método       | `GET` |
| Caminho      | `/search.json?q=inception&limit=1` |
| URL          | `https://openlibrary.org/search.json?q=inception&limit=1` |
| Status       | `200` |
| Content-Type | `application/json` |

Comparando com a tabela de `docs/requisitos.md`:

| CineTrack (requisitos) | API observada |
|------------------------|---------------|
| Listar / buscar: `GET /filmes` | Busca: `GET /search.json?...` |
| A URL aponta para o recurso (filmes ou resultados de busca) | O caminho também aponta para o recurso de busca |
| O `GET` só lê, sem corpo na requisição | Aqui também: só lê e devolve JSON |
| Resposta esperada: lista de filmes em JSON | Resposta: lista de documentos em JSON (`application/json`) |

O caminho é diferente (`/filmes` e `/search.json`) e os parâmetros de consulta também, mas a ideia REST é a mesma: a URL identifica o recurso e o método diz o que se quer fazer com ele.

## 5. Fechamento: listagem no CineTrack

Na Parte 2, o CineTrack vai listar os filmes com `GET` na rota `/filmes`. No corpo da resposta deve vir um JSON com a lista de filmes, cada um com título, ano, gênero, pôster, status, nota e comentário, como está em `docs/requisitos.md`.
