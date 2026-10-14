export default function Estrelas({ nota }) {
  let resultado = "";
  for (let i = 1; i <= 5; i++) {
    resultado += i <= nota ? "★" : "☆";
  }
  return resultado;
}
