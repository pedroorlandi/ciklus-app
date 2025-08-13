import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function FinancialChart() {
  const [period, setPeriod] = useState("5");

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Projeção Financeira</h2>
        <div className="flex items-center space-x-2">
          {["5", "10", "15"].map((years) => (
            <Button
              key={years}
              variant={period === years ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(years)}
              className={period === years ? "bg-primary text-white" : ""}
            >
              {years} Anos
            </Button>
          ))}
        </div>
      </div>
      
      {/* Chart placeholder */}
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-16 w-16 mx-auto mb-4" />
          <p className="text-sm">
            Gráfico de projeção patrimonial para {period} anos
          </p>
          <p className="text-xs mt-2">
            Chart.js será integrado aqui para visualização interativa
          </p>
        </div>
      </div>
    </div>
  );
}
