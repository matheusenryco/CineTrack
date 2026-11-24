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
  A API e o armazenamento no servidor chegam na Parte 2 (abaixo).
- A chave da TMDB, por ser uma aplicação só de frontend, fica visível no navegador. A Parte 2 não usa a
  TMDB: os pôsteres vêm de `frontend/public/img` ou da URL informada no cadastro.

## Parte 2 (v2.0)

Aplicação full stack: frontend React (Vite) em `frontend/` consumindo uma API REST em Node.js/Express em
`backend/`. Os filmes ficam em `backend/data/filmes.json`. A pasta `parte1/` permanece como na tag v1.0.

### Como rodar do zero

Pré-requisitos: Git e Node.js 20.6 ou mais novo (o `npm start` usa `--env-file`; testado no Node 22).
Backend e frontend rodam ao mesmo tempo, cada um em um terminal.

```bash
git clone https://github.com/matheusenryco/CineTrack.git
cd CineTrack
```

**Terminal 1, backend:**

```bash
cd backend
npm install
cp .env.example .env   # PORT=3000
node seed.js           # grava os 6 filmes iniciais em data/filmes.json (o mesmo que npm run seed)
npm start              # ou npm run dev, que reinicia ao salvar
```

A API responde em `http://localhost:3000` (`GET /` devolve `{"ola":"CineTrack"}`). Mantenha a porta 3000: o
frontend chama essa URL, definida em `frontend/src/api.js`.

**Terminal 2, frontend:**

```bash
cd frontend
npm install
npm run dev     # abre em http://localhost:5173
```

Para gerar o build de produção: `npm run build` (sai em `frontend/dist`).

Para voltar aos 6 filmes iniciais, pare o backend e rode `node seed.js` de novo.

### O que funciona

- **CRUD completo pela API:** listar, adicionar, editar e remover filmes pelo modal; tudo é gravado em
  `backend/data/filmes.json` e persiste ao reiniciar o servidor.
- **Busca e filtro por status**, combinados, lembrados entre visitas (`localStorage`, chave `cinetrack:filtros`).
- **Validação no servidor:** `POST` e `PUT` exigem título, ano entre 1888 e 2030, nota de 1 a 5 e status
  `assistido`, `assistindo` ou `quero`. Um corpo inválido devolve `400` com todos os problemas de uma vez
  (`{ "erros": [...] }`), e o modal mostra a lista ao usuário sem fechar.
- **Backend fora do ar:** a tela avisa "Não foi possível conectar à API".

### Documentação e testes

- [`docs/api.md`](docs/api.md): todas as rotas, com parâmetros, corpo esperado e códigos de resposta.
- [`docs/testes-parte2.md`](docs/testes-parte2.md): teste ponta a ponta a partir de um clone limpo (seed,
  backend, frontend, CRUD pela interface e persistência após reiniciar) e testes da API com `curl`.

### Limitações conhecidas

- A URL da API está fixa em `frontend/src/api.js`; mudar a `PORT` do backend exige mudar ali também.
- Filmes sem URL de pôster aparecem com a imagem quebrada (só o texto alternativo).
