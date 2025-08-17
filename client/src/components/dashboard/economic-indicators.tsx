import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function EconomicIndicators() {
  const { data: indices, isLoading } = useQuery({
    queryKey: ["/api/indices"],
  });

  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) return TrendingUp;
    if (change.startsWith("-")) return TrendingDown;
    return Minus;
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-green-600";
    if (change.startsWith("-")) return "text-red-600";
    return "text-gray-500";
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Índices Econômicos</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const defaultIndices = [
    { nome: "CDI", valor: "13.75", tipo: "taxa", unidade: "%", change: "+0.25%" },
    { nome: "SELIC", valor: "13.25", tipo: "taxa", unidade: "%", change: "0.00%" },
    { nome: "USD_BRL", valor: "5.12", tipo: "cambio", unidade: "R$", change: "-0.03%" },
  ];

  const displayIndices = (indices && Array.isArray(indices) && indices.length > 0) ? indices : defaultIndices;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Índices Econômicos</h3>
      <div className="space-y-4">
        {displayIndices.map((indice: any, index: number) => {
          const ChangeIcon = getChangeIcon(indice.change || "0%");
          return (
            <div key={indice.nome || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {indice.nome === "USD_BRL" ? "USD/BRL" : indice.nome}
                </p>
                <p className="text-xs text-gray-500">
                  {indice.tipo === "taxa" ? "Taxa atual" : 
                   indice.tipo === "cambio" ? "Câmbio" : "Índice"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {indice.unidade === "R$" ? `R$ ${indice.valor}` : `${indice.valor}${indice.unidade}`}
                </p>
                <div className={`text-xs flex items-center justify-end ${getChangeColor(indice.change || "0%")}`}>
                  <ChangeIcon className="h-3 w-3 mr-1" />
                  {indice.change || "0%"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
