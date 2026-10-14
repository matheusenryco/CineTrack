# CineTrack

CineTrack é um gerenciador pessoal de filmes desenvolvido como projeto integrador da disciplina de Programação de Sistemas Web. Permite cadastrar, listar, buscar e filtrar filmes por status (assistido, quero assistir, assistindo). O projeto é dividido em duas partes: a primeira constrói um frontend interativo com HTML, CSS e JavaScript; a segunda acrescenta uma API REST e persistência de dados. Serve como base prática para os conceitos de sistemas web vistos em aula, como HTTP, REST, camadas e arquitetura cliente-servidor.

## Parte 1 (v1.0)

Frontend em `parte1/`, sem dependências: abra `parte1/index.html` no navegador (ou sirva a pasta com qualquer servidor estático).

### Funcionalidades

- **Lista de filmes** em cards (pôster, título, ano, gênero, nota e status).
- **Filtro por status** (Todos, Assistido, Assistindo, Quero assistir).
- **Busca por título** ao vivo, com debounce de 300 ms, combinada com o filtro de status.
- **Adicionar, editar e remover** filmes por um modal com validação.
- **Persistência** no `localStorage` (chave `cinetrack:filmes`): a lista sobrevive ao recarregar a página.
- **Pôsteres via TMDB** (opcional): preencha `TMDB_KEY` em `parte1/app.js` e os filmes cadastrados sem pôster passam a buscá-lo na TMDB.

### Estrutura

| Arquivo | Conteúdo |
|---------|----------|
| `parte1/index.html` | Página principal (busca, filtros, lista e modal) |
| `parte1/adicionar.html` | Formulário de cadastro em página própria |
| `parte1/sobre.html` | Sobre o projeto |
| `parte1/app.js` | Renderização, filtros, busca, CRUD e persistência |
| `parte1/style.css` | Estilos (tema claro/escuro, grid responsivo) |

### Acessibilidade

Lighthouse (categoria Acessibilidade) na página principal: **100** após o ajuste de contraste do selo "Assistindo" (era 95 antes).

### Docs

Requisitos e análise HTTP em `docs/`.
