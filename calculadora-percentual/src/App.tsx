import { useState } from "react";

type Marca = {
  nome: string;
  valor: number;
};

const MARCAS_INICIAIS: Marca[] = [
  { nome: "Selection", valor: 0 },
  { nome: "Spike", valor: 0 },
  { nome: "Zee", valor: 0 },
  { nome: "SuperSecao", valor: 0 },
  { nome: "Fresh", valor: 0 },
  { nome: "Petz", valor: 0 },
  { nome: "BabyPads", valor: 0 },
  { nome: "Fuzz", valor: 0 },
  { nome: "CDSG", valor: 0 },
  { nome: "Happymed", valor: 0 },
];

export default function App() {
  const [marcas, setMarcas] = useState<Marca[]>(MARCAS_INICIAIS);
  const [totalVendas, setTotalVendas] = useState("");
  const [percentual, setPercentual] = useState<number | null>(null);

  function atualizarValor(index: number, valor: string) {
    const novoValor = Number(valor);

    setMarcas((prev) =>
      prev.map((marca, i) =>
        i === index
          ? { ...marca, valor: isNaN(novoValor) ? 0 : novoValor }
          : marca
      )
    );
  }

  function calcularPercentual() {
    const total = Number(totalVendas);
    if (isNaN(total) || total <= 0) {
      alert("Informe um total de vendas válido.");
      return;
    }

    const somaMarcas = marcas.reduce((acc, m) => acc + m.valor, 0);
    const resultado = (somaMarcas / total) * 100;

    setPercentual(resultado);
  }

  const somaMarcas = marcas.reduce((acc, m) => acc + m.valor, 0);

  return (
    <div className="container">
      <h1>Marcas Próprias x Total de Vendas</h1>

      <section className="card">
        <h2>Vendas por marca</h2>

        {marcas.map((marca, index) => (
          <div key={marca.nome} className="linha-marca">
            <span>{marca.nome}</span>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={marca.valor === 0 ? "" : marca.valor}
              onChange={(e) => atualizarValor(index, e.target.value)}
            />
          </div>
        ))}

        <strong>
          Total marcas próprias: R$ {somaMarcas.toFixed(2)}
        </strong>
      </section>

      <section className="card">
        <h2>Total de vendas da loja</h2>

        <input
          type="number"
          placeholder="Ex: 100000"
          value={totalVendas}
          onChange={(e) => setTotalVendas(e.target.value)}
        />

        <button onClick={calcularPercentual}>
          Calcular percentual
        </button>
      </section>

      {percentual !== null && (
        <section className="resultado">
          <h2>Resultado</h2>
          <p>
            As marcas próprias representam{" "}
            <strong>{percentual.toFixed(2)}%</strong> do total de vendas.
          </p>
        </section>
      )}
    </div>
  );
}
