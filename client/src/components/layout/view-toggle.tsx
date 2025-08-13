import { Button } from "@/components/ui/button"
import { Grid, Table } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "cards" | "table"
  onViewChange: (view: "cards" | "table") => void
  className?: string
}

export default function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex rounded-lg border bg-gray-100 p-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("cards")}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          view === "cards"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Grid className="h-4 w-4" />
        Cards
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("table")}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          view === "table"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Table className="h-4 w-4" />
        Tabela
      </Button>

    </div>
  )
}