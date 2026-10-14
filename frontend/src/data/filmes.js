export const filmesIniciais = [
    { id: 1, titulo: "A Origem", ano: 2010, genero: "Ficção científica", poster: "img/a-origem.jpg", nota: 5, status: "assistido", comentario: "Um sonho dentro de outro sonho." },
    { id: 2, titulo: "Parasita", ano: 2019, genero: "Suspense", poster: "img/parasite.jpg", nota: 4, status: "assistido", comentario: "Crítica social afiada e cheia de reviravoltas." },
    { id: 3, titulo: "O Auto da Compadecida", ano: 2000, genero: "Comédia", poster: "img/a-dogs-will.jpg", nota: 5, status: "assistido", comentario: "Clássico do humor brasileiro." },
    { id: 4, titulo: "Duna: Parte Dois", ano: 2024, genero: "Ficção científica", poster: "img/dune-part-two.jpg", nota: 4, status: "assistindo", comentario: "Visual impressionante, vendo aos poucos." },
    { id: 5, titulo: "Interestelar", ano: 2014, genero: "Ficção científica", poster: "img/interstelar.jpg", nota: 5, status: "quero", comentario: "Dizem que a trilha sonora é incrível." },
    { id: 6, titulo: "Cidade de Deus", ano: 2002, genero: "Drama", poster: "img/city-of-god.jpg", nota: 4, status: "quero", comentario: "Está na lista há muito tempo." }
];

// Próximo id: o maior id existente mais 1 (o 0 cobre a lista vazia)
export const gerarId = (itens) => Math.max(0, ...itens.map((f) => f.id)) + 1;
