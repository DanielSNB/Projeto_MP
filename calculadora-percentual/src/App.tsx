import { useState } from "react";
import "./App.css";

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

const META_PERCENTUAL = 0.2;

// Formata valor para moeda BR
function formatCurrency(value: string) {
  const apenasNumeros = value.replace(/\D/g, "");
  const numero = Number(apenasNumeros) / 100;

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Converte string formatada em número
function parseCurrency(value: string) {
  const apenasNumeros = value.replace(/\D/g, "");
  return Number(apenasNumeros) / 100;
}

export default function App() {
  const [marcas, setMarcas] = useState<Marca[]>(MARCAS_INICIAIS);

  const [valoresFormatados, setValoresFormatados] = useState<string[]>(
    MARCAS_INICIAIS.map(() => "")
  );

  const [totalVendasFormatado, setTotalVendasFormatado] = useState("");
  const [totalVendasNumero, setTotalVendasNumero] = useState(0);

  const [percentual, setPercentual] = useState<number | null>(null);
  const [diferencaMeta, setDiferencaMeta] = useState<number | null>(null);

  function atualizarValor(index: number, valorDigitado: string) {
    const numero = parseCurrency(valorDigitado);

    setMarcas((prev) =>
      prev.map((marca, i) =>
        i === index ? { ...marca, valor: numero } : marca
      )
    );

    setValoresFormatados((prev) =>
      prev.map((v, i) =>
        i === index ? formatCurrency(valorDigitado) : v
      )
    );
  }

  function handleTotalVendasChange(valorDigitado: string) {
    const numero = parseCurrency(valorDigitado);

    setTotalVendasFormatado(formatCurrency(valorDigitado));
    setTotalVendasNumero(numero);
  }

  function calcularPercentual() {
    if (totalVendasNumero <= 0) {
      alert("Informe um total de vendas válido.");
      return;
    }

    const somaMarcas = marcas.reduce((acc, m) => acc + m.valor, 0);
    const percentualCalculado =
      (somaMarcas / totalVendasNumero) * 100;

    const metaEmReais = totalVendasNumero * META_PERCENTUAL;
    const diferenca = somaMarcas - metaEmReais;

    setPercentual(percentualCalculado);
    setDiferencaMeta(diferenca);
  }

  const somaMarcas = marcas.reduce((acc, m) => acc + m.valor, 0);
  const metaEmReais = totalVendasNumero * META_PERCENTUAL;

  return (
    <div className="container">
      <h1>Marcas Próprias x Total de Vendas</h1>

      <section className="card">
        <h2>Vendas por marca</h2>

        {marcas.map((marca, index) => (
          <div key={marca.nome} className="linha-marca">
            <span>{marca.nome}</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={valoresFormatados[index]}
              onChange={(e) =>
                atualizarValor(index, e.target.value)
              }
            />
          </div>
        ))}

        <strong>
          Total marcas próprias:{" "}
          {somaMarcas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </strong>
      </section>

      <section className="card">
        <h2>Total de vendas da loja</h2>

        <input
          type="text"
          inputMode="numeric"
          placeholder="R$ 0,00"
          value={totalVendasFormatado}
          onChange={(e) =>
            handleTotalVendasChange(e.target.value)
          }
        />

        <button onClick={calcularPercentual}>
          Calcular percentual
        </button>
      </section>

      {percentual !== null && diferencaMeta !== null && (
        <section className="resultado">
          <h2>Resultado</h2>

          <p>
            As marcas próprias representam{" "}
            <strong>{percentual.toFixed(2)}%</strong> do total de
            vendas.
          </p>

          <p>
            Meta de 20%:{" "}
            <strong>
              {metaEmReais.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </p>

          <p
            style={{
              color: diferencaMeta < 0 ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {diferencaMeta < 0
              ? `Faltam ${Math.abs(diferencaMeta).toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" }
                )} para bater a meta`
              : `Meta ultrapassada em ${diferencaMeta.toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" }
                )}`}
          </p>
        </section>
      )}
    </div>
  );
}
