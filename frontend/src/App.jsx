import Titulo from "./components/Titulo.jsx";

const anoAtual = new Date().getFullYear();

export default function App() {
  return (
    <>
      <Titulo />
      <p>Ano atual: {anoAtual}</p>
    </>
  );
}
