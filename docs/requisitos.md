# Requisitos do CineTrack

## Campos de um filme

1. Título
2. Ano
3. Gênero
4. Pôster (URL da imagem)
5. Status (quero assistir, assistindo, assistido)
6. Nota
7. Comentário

## Áreas da interface

1. Busca por título
2. Filtros de status
3. Lista de filmes
4. Formulário de cadastro

## Operações da API

| Ação      | Método | Rota          |
|-----------|--------|---------------|
| Listar    | GET    | /filmes       |
| Buscar    | GET    | /filmes/:id   |
| Cadastrar | POST   | /filmes       |
| Editar    | PUT    | /filmes/:id   |
| Remover   | DELETE | /filmes/:id   |
