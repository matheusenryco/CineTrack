# Testes da Parte 1 (Marco 1)

Teste de mesa do `parte1/` antes da avaliação, seguindo o roteiro da ANP 05.

## Como foi executado

- **Versão testada (1ª rodada):** commit `7c15b92` (`feat: busca e persistencia`, tag `v1.0` original).
- **Ambiente:** Google Chrome headless, janela de 1280x900, página servida por `python3 -m http.server`.
- **Execução:** cada caso rodou em um perfil de navegador novo (sem `localStorage`), pelo script de automação
  que digita, clica e lê o DOM e o `localStorage` como um usuário faria. Nada foi simulado por atalho.
- **Partida de cada caso:** primeira visita, com os 6 filmes iniciais.
- **Chamadas à TMDB bloqueadas** durante os testes, para o resultado não depender da rede. Os pôsteres usados
  nos cadastros apontam para imagens do próprio projeto.

## Resultado do roteiro

| # | Caso | Resultado esperado | Resultado obtido | Passou? | Correção feita |
|---|------|--------------------|------------------|---------|----------------|
| 1 | Adicionar um filme válido (Matrix, 1999, nota 5) | O card aparece sem recarregar a página | 7 cards, "Matrix" na lista, marcador JS da página preservado (sem reload), modal fechado, 7 filmes no `localStorage` | Passou | - |
| 2 | Enviar ano fora da faixa (1800) | O erro aparece na interface e nada é salvo | 6 cards, nada gravado no `localStorage`, modal continua aberto. O navegador mostra "Value must be greater than or equal to 1888" no campo Ano, por causa de `min="1888"`. Nenhuma mensagem do JS, porque a validação nativa impede o `submit` antes | Passou | - (ver observação 2a) |
| 3 | Editar um filme (Parasita: novo título e nota 3) | O card certo muda, sem duplicar | **1ª rodada:** nada mudou. Ao clicar em Salvar o formulário não enviava, e o campo de pôster acusava "Please enter a URL" (o pôster `img/parasite.jpg` é um caminho relativo e o campo era `type="url"`). **Após a correção:** 6 cards, título "Parasita (Editado)", nota ★★★☆☆, os demais intactos, sem duplicata | **Falhou**, depois passou | `fix: permitir editar filme com poster local` (campo de pôster passou a `type="text"`) |
| 4 | Remover e cancelar a confirmação | O filme continua | `confirm("Remover este filme?")` exibido; ao cancelar, 6 cards e "A Origem" presente. Ao confirmar em seguida, 5 cards | Passou | - |
| 5 | Busca + filtro de status juntos | Os dois critérios combinam | "Quero assistir" + `cid` → só "Cidade de Deus". "Quero assistir" + `inter` → só "Interestelar". Trocar para "Assistido" mantendo `inter` → lista vazia. "Todos" + `cid` → "O Auto da Compadecida" e "Cidade de Deus" | Passou | - |
| 6 | Recarregar a página | A lista persiste | Adicionei "Matrix" e removi "Cidade de Deus" (6 cards); após `reload` continuaram 6 cards, com "Matrix" e sem "Cidade de Deus" | Passou | - |
| 7 | Esc e Cancelar fecham o modal | O modal fecha nos dois casos | "+ Adicionar" → Esc fecha. "+ Adicionar" → Cancelar fecha. Editar → Esc fecha. Nenhum filme alterado (6 cards) | Passou | - |
| 8 | Primeira visita (limpar `cinetrack:filmes`) | Os 6 filmes canônicos carregam | Com 7 filmes salvos, removi a chave e recarreguei: voltaram exatamente os 6 filmes iniciais (A Origem, Parasita, O Auto da Compadecida, Duna: Parte Dois, Interestelar, Cidade de Deus) | Passou | - |

### Observações

**2a. Validação nativa x `validarFilme`.** Para o ano fora da faixa, quem barra é o próprio navegador
(`min`/`max`), então a função `validarFilme` e a mensagem de erro na interface não chegam a rodar. Para exercitar o caminho do JS,
foi feito o caso extra abaixo.

### Caso extra: título só com espaços

| Caso | Resultado esperado | Resultado obtido | Passou? | Correção feita |
|------|--------------------|------------------|---------|----------------|
| Enviar título `"   "` (ano e demais campos válidos) | O erro aparece e nada é salvo | **1ª rodada:** o filme foi salvo com título em branco (7 cards, card sem nome). O `required` aceita espaços e `validarFilme` só testava `!filme.titulo`. **Após a correção:** mensagem "Título obrigatório" exibida no modal, 6 cards, nada gravado | **Falhou**, depois passou | `fix: rejeitar titulo so com espacos` (`dados.titulo.trim()` antes de validar) |

## Ordenação (`feat: ordenacao`)

Testada depois de implementada, também no navegador:

| Caso | Resultado esperado | Resultado obtido | Passou? |
|------|--------------------|------------------|---------|
| Ordem padrão e acentos | "Título (A-Z)" ao abrir; "Ágata" e "Éden" entre os demais "A"/"E", não no fim | A Origem, Ágata, Cidade de Deus, Duna: Parte Dois, Éden, Interestelar, O Auto da Compadecida, Parasita, Zorro | Passou |
| Ano e nota | Ano do mais recente ao mais antigo; nota da maior para a menor | Anos: 2024, 2019, 2014, 2010, 2002, 2000. Notas: 5, 5, 5, 4, 4, 4 | Passou |
| Ordenar + filtro + busca | Ordenar não desliga os outros critérios; trocar de filtro mantém a ordem | "Assistido" + ano → Parasita, A Origem, O Auto da Compadecida. + busca `a` → mesma lista. Trocar para "Quero assistir" (ordem continua "ano") → Interestelar (2014), Cidade de Deus (2002). Trocar para título → Cidade de Deus, Interestelar | Passou |
| `filmes` não é mutado | Ordenar não altera a ordem da lista salva | Depois de ordenar por nota e ano e adicionar "Alfa", o `localStorage` mantém a ordem de inserção original, com "Alfa" no fim | Passou |

## Acessibilidade

Lighthouse (categoria Acessibilidade), versão final, três páginas: `index.html` 100, `adicionar.html` 100,
`sobre.html` 100.

## Resumo

- 8 casos do roteiro: 7 passaram de primeira, 1 falhou (editar) e foi corrigido.
- 1 caso extra encontrado durante os testes (título só com espaços): falhou e foi corrigido.
- 2 commits `fix:`, um por correção, e `feat: ordenacao` para a funcionalidade nova.
- Rodada final de regressão: todos os casos acima passam na versão final.
