# CineTrack

CineTrack é um gerenciador pessoal de filmes desenvolvido como projeto integrador da disciplina de Programação de Sistemas Web (UEM). Permite cadastrar, listar, buscar, filtrar e ordenar filmes por status (assistido, quero assistir, assistindo). O projeto é dividido em duas partes: a primeira constrói um frontend interativo com HTML, CSS e JavaScript; a segunda acrescenta uma API REST e persistência de dados. Serve como base prática para os conceitos de sistemas web vistos em aula, como HTTP, REST, camadas e arquitetura cliente-servidor.

## Autor

- Matheus Enryco Marques — RA140503

## Parte 1 (v1.0)

Frontend em `parte1/`, sem dependências e sem etapa de build. Todo o JavaScript está em um único `app.js`.

### Como executar

1. Clone o repositório.
2. Abra `parte1/index.html` no navegador, ou sirva a pasta com qualquer servidor estático, por exemplo:
   ```bash
   cd parte1
   python3 -m http.server 8000
   ```
   e acesse `http://localhost:8000`.

Na primeira visita a lista começa com 6 filmes de exemplo. Para voltar a esse estado, apague a chave
`cinetrack:filmes` em DevTools → Application → Local Storage e recarregue.

### O que funciona

- **Lista de filmes** em cards (pôster, título, ano, gênero, nota e status).
- **Filtro por status:** Todos, Assistido, Assistindo, Quero assistir.
- **Busca por título** ao vivo, com debounce de 300 ms, combinada com o filtro de status.
- **Ordenação** por título (A-Z, com acentos tratados por `localeCompare`), ano (mais recente primeiro) ou
  nota (maior primeiro). Combina com a busca e o filtro, e a escolha se mantém ao trocar de filtro.
- **Adicionar, editar e remover** filmes por um modal, com validação e confirmação ao remover.
  O modal fecha com Cancelar ou Esc.
- **Persistência** no `localStorage` (chave `cinetrack:filmes`): a lista sobrevive ao recarregar a página.
- **Pôsteres via TMDB** (opcional): com `TMDB_KEY` preenchida em `parte1/app.js`, filmes cadastrados sem
  pôster passam a buscá-lo na TMDB. Sem a chave, nada é buscado.

### Estrutura

| Arquivo | Conteúdo |
|---------|----------|
| `parte1/index.html` | Página principal (busca, filtros, ordenação, lista e modal) |
| `parte1/adicionar.html` | Formulário de cadastro em página própria |
| `parte1/sobre.html` | Sobre o projeto |
| `parte1/app.js` | Renderização, filtros, busca, ordenação, CRUD e persistência |
| `parte1/style.css` | Estilos (tema claro/escuro, grid responsivo) |
| `docs/` | Requisitos, análise HTTP e roteiro de testes da Parte 1 |

### Testes e acessibilidade

- O roteiro de testes de mesa, com resultados e correções, está em
  [`docs/testes-parte1.md`](docs/testes-parte1.md).
- Lighthouse (categoria Acessibilidade): **100** em `index.html`, `adicionar.html` e `sobre.html`.

### Limitações conhecidas

- Os dados ficam só no navegador (`localStorage`): não há conta nem sincronização entre dispositivos.
  A API e o armazenamento no servidor chegam na Parte 2.
- A chave da TMDB, por ser uma aplicação só de frontend, fica visível no navegador. Na Parte 2 a chamada
  passa por um proxy no backend.
