import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { useState, useRef, useEffect, KeyboardEvent, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Edit, Save, X } from "lucide-react"

interface EditableDataTableProps<TData> {
  data: TData[]
  onSave: (updatedData: TData[]) => void
  searchKey?: string
  searchPlaceholder?: string
  initialEditMode?: boolean
}

export function EditableDataTable<TData extends { id: number }>({
  data,
  onSave,
  searchKey,
  searchPlaceholder = "Filtrar...",
  initialEditMode = false,
}: EditableDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isEditMode, setIsEditMode] = useState(initialEditMode)
  const [editedData, setEditedData] = useState<TData[]>(data)
  const [currentCell, setCurrentCell] = useState<{ row: number; col: string } | null>(null)
  const [dateInputValues, setDateInputValues] = useState<{ [key: string]: string }>({})
  const cellRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    setEditedData(data)
    // Limpar valores de input de data quando os dados mudarem
    setDateInputValues({})
  }, [data])

  useEffect(() => {
    setIsEditMode(initialEditMode)
  }, [initialEditMode])

  const handleCellEdit = (rowIndex: number, field: string, value: any) => {
    setEditedData(prevData => {
      const newData = [...prevData]
      newData[rowIndex] = { ...newData[rowIndex], [field]: value }
      return newData
    })
  }

  const handleKeyDown = (e: KeyboardEvent, rowIndex: number, field: string) => {
    if (!isEditMode) return

    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        const fieldOrder = ['nome', 'parentesco', 'dataNascimento', 'ocupacao', 'renda', 'dependente']
        const currentFieldIndex = fieldOrder.indexOf(field)
        
        if (e.shiftKey) {
          // Shift+Tab: ir para campo anterior
          if (currentFieldIndex > 0) {
            const prevField = fieldOrder[currentFieldIndex - 1]
            setCurrentCell({ row: rowIndex, col: prevField })
            setTimeout(() => {
              const cellKey = `${rowIndex}-${prevField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          } else if (rowIndex > 0) {
            const lastField = fieldOrder[fieldOrder.length - 1]
            setCurrentCell({ row: rowIndex - 1, col: lastField })
            setTimeout(() => {
              const cellKey = `${rowIndex - 1}-${lastField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        } else {
          // Tab: ir para próximo campo
          if (currentFieldIndex < fieldOrder.length - 1) {
            const nextField = fieldOrder[currentFieldIndex + 1]
            setCurrentCell({ row: rowIndex, col: nextField })
            setTimeout(() => {
              const cellKey = `${rowIndex}-${nextField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          } else if (rowIndex < editedData.length - 1) {
            const firstField = fieldOrder[0]
            setCurrentCell({ row: rowIndex + 1, col: firstField })
            setTimeout(() => {
              const cellKey = `${rowIndex + 1}-${firstField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        }
        break
      case 'Enter':
        e.preventDefault()
        if (rowIndex < editedData.length - 1) {
          setCurrentCell({ row: rowIndex + 1, col: field })
          setTimeout(() => {
            const cellKey = `${rowIndex + 1}-${field}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        }
        break
      case 'ArrowLeft':
        // Apenas prevenir para elementos que não são inputs de texto
        if (!(e.target instanceof HTMLInputElement) || e.target.type === 'checkbox') {
          e.preventDefault()
          const fieldOrderLeft = ['nome', 'parentesco', 'dataNascimento', 'ocupacao', 'renda', 'dependente']
          const currentFieldIndexLeft = fieldOrderLeft.indexOf(field)
          if (currentFieldIndexLeft > 0) {
            const prevField = fieldOrderLeft[currentFieldIndexLeft - 1]
            setCurrentCell({ row: rowIndex, col: prevField })
            setTimeout(() => {
              const cellKey = `${rowIndex}-${prevField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        }
        break
      case 'ArrowRight':
        // Apenas prevenir para elementos que não são inputs de texto
        if (!(e.target instanceof HTMLInputElement) || e.target.type === 'checkbox') {
          e.preventDefault()
          const fieldOrderRight = ['nome', 'parentesco', 'dataNascimento', 'ocupacao', 'renda', 'dependente']
          const currentFieldIndexRight = fieldOrderRight.indexOf(field)
          if (currentFieldIndexRight < fieldOrderRight.length - 1) {
            const nextField = fieldOrderRight[currentFieldIndexRight + 1]
            setCurrentCell({ row: rowIndex, col: nextField })
            setTimeout(() => {
              const cellKey = `${rowIndex}-${nextField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        }
        break
      case 'ArrowUp':
        // Apenas prevenir para elementos que não são inputs de texto
        if (!(e.target instanceof HTMLInputElement) || e.target.type === 'checkbox') {
          e.preventDefault()
          if (rowIndex > 0) {
            setCurrentCell({ row: rowIndex - 1, col: field })
            setTimeout(() => {
              const cellKey = `${rowIndex - 1}-${field}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        }
        break
      case 'ArrowDown':
        // Apenas prevenir para elementos que não são inputs de texto
        if (!(e.target instanceof HTMLInputElement) || e.target.type === 'checkbox') {
          e.preventDefault()
          if (rowIndex < editedData.length - 1) {
            setCurrentCell({ row: rowIndex + 1, col: field })
            setTimeout(() => {
              const cellKey = `${rowIndex + 1}-${field}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        }
        break
      case 'Escape':
        setIsEditMode(false)
        setEditedData(data)
        setCurrentCell(null)
        break
    }
  }

  // Função para aplicar máscara de data DD/MM/YYYY
  const formatDateInput = (value: string) => {
    // Remover tudo que não é número ou barra
    let cleanValue = value.replace(/[^\d\/]/g, '');
    
    // Remover barras para reprocessar
    const numbersOnly = cleanValue.replace(/\//g, '');
    
    // Aplicar máscara baseada na quantidade de números
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length <= 8) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    } else {
      // Limitar a 8 dígitos
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
  };

  // Função para converter DD/MM/YYYY para YYYY-MM-DD
  const convertToISODate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 10) return '';
    const [day, month, year] = dateStr.split('/');
    if (day && month && year && year.length === 4) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      // Validar se a data é válida
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return '';
  };

  // Função para converter YYYY-MM-DD para DD/MM/YYYY
  const convertFromISODate = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  const renderEditableCell = (value: any, rowIndex: number, field: string, type: 'text' | 'number' | 'select' | 'boolean' | 'date' = 'text', options?: string[]) => {
    const cellKey = `${rowIndex}-${field}`
    
    if (!isEditMode) {
      if (type === 'boolean') {
        return <span>{value ? 'Sim' : 'Não'}</span>
      }
      if (type === 'number' && field === 'renda') {
        return <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value || "0"))}</span>
      }
      if (field === 'parentesco') {
        const names: { [key: string]: string } = {
          'conjuge': 'Cônjuge',
          'filho': 'Filho(a)',
          'pai': 'Pai',
          'mae': 'Mãe',
          'irmao': 'Irmão(ã)',
          'outro': 'Outro',
        }
        return <span>{names[value] || value}</span>
      }
      return <span>{value}</span>
    }

    const commonProps = {
      onKeyDown: (e: KeyboardEvent) => handleKeyDown(e, rowIndex, field),
      className: "w-full border-0 bg-transparent focus:ring-1 focus:ring-primary",
      onFocus: () => setCurrentCell({ row: rowIndex, col: field })
    }

    switch (type) {
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => {
              // O valor checked representa se é provedor (true) ou não (false)
              // Precisamos salvar como dependente, então invertemos: provedor=true -> dependente=false
              if (field === 'dependente') {
                handleCellEdit(rowIndex, field, !checked);
              } else {
                handleCellEdit(rowIndex, field, checked);
              }
            }}
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleCellEdit(rowIndex, field, newValue)}
          >
            <SelectTrigger 
              className="w-full border-0 bg-transparent focus:ring-1 focus:ring-primary"
              ref={(el) => cellRefs.current[cellKey] = el}
              {...commonProps}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {field === 'parentesco' && {
                    'conjuge': 'Cônjuge',
                    'filho': 'Filho(a)',
                    'pai': 'Pai',
                    'mae': 'Mãe',
                    'irmao': 'Irmão(ã)',
                    'outro': 'Outro',
                  }[option] || option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'date':
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            step={field === 'renda' ? "0.01" : "1"}
            value={value || ""}
            onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
      default:
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
    }
  }

  const columns: ColumnDef<TData>[] = useMemo(() => [
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Nome
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2">
          {renderEditableCell(row.getValue("nome"), row.index, "nome")}
        </div>
      ),
    },
    {
      accessorKey: "parentesco",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Parentesco
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2">
          {renderEditableCell(
            row.getValue("parentesco"), 
            row.index, 
            "parentesco", 
            "select",
            ['conjuge', 'filho', 'pai', 'mae', 'irmao', 'outro']
          )}
        </div>
      ),
    },
    {
      accessorKey: "dataNascimento",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Data Nascimento
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2">
          {renderEditableCell(row.getValue("dataNascimento"), row.index, "dataNascimento", "date")}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.getValue("dataNascimento") || "1900-01-01");
        const dateB = new Date(rowB.getValue("dataNascimento") || "1900-01-01");
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      accessorKey: "idade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Idade
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => {
        const dataNascimento = row.original.dataNascimento;
        if (!dataNascimento) return <div className="p-2">0 anos</div>;
        
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        
        return <div className="p-2">{idade} anos</div>;
      },
      sortingFn: (rowA, rowB) => {
        const calcAge = (dateStr: string) => {
          if (!dateStr) return 0;
          const hoje = new Date();
          const nascimento = new Date(dateStr);
          let idade = hoje.getFullYear() - nascimento.getFullYear();
          const mes = hoje.getMonth() - nascimento.getMonth();
          if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
          }
          return idade;
        };
        
        const ageA = calcAge(rowA.original.dataNascimento);
        const ageB = calcAge(rowB.original.dataNascimento);
        return ageA - ageB;
      },
    },
    {
      accessorKey: "ocupacao",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Ocupação
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2">
          {renderEditableCell(row.getValue("ocupacao"), row.index, "ocupacao")}
        </div>
      ),
    },
    {
      accessorKey: "renda",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Renda
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="p-2">
          {renderEditableCell(row.getValue("renda"), row.index, "renda", "number")}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const rendaA = parseFloat(rowA.getValue("renda") || "0");
        const rendaB = parseFloat(rowB.getValue("renda") || "0");
        return rendaA - rendaB;
      },
    },
    {
      accessorKey: "dependente",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Provedor
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => {
        const isProvedor = !row.getValue("dependente");
        return (
          <div className="p-2">
            {renderEditableCell(isProvedor, row.index, "dependente", "boolean")}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const isProvedorA = !rowA.getValue("dependente");
        const isProvedorB = !rowB.getValue("dependente");
        return isProvedorA === isProvedorB ? 0 : isProvedorA ? -1 : 1;
      },
    },
  ], [isEditMode])

  const table = useReactTable({
    data: editedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleSave = () => {
    console.log("=== EDITABLE TABLE SAVE ===")
    console.log("Edited data before save:", editedData)
    
    // Filtrar apenas dados que existem e têm ID
    const validData = editedData.filter(item => item && item.id)
    console.log("Valid data to save:", validData)
    
    onSave(validData)
    setIsEditMode(false)
    setCurrentCell(null)
  }

  const handleCancel = () => {
    setEditedData(data)
    setIsEditMode(false)
    setCurrentCell(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isEditMode}
          />
        )}
        
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <Button
              onClick={() => setIsEditMode(true)}
              size="sm"
              className="bg-primary hover:bg-primary-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Tabela
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Tudo
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <strong>Modo de Edição Ativado:</strong> Use Tab/Shift+Tab para navegar entre campos, Enter/Setas para navegar entre linhas, Esc para cancelar.
        </div>
      )}

      <div className={`rounded-md border bg-white ${isEditMode ? 'ring-2 ring-primary ring-opacity-50' : ''}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort() && !isEditMode
                              ? "cursor-pointer select-none flex items-center"
                              : "flex items-center"
                          }
                          onClick={!isEditMode ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && !isEditMode && (
                            <>
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="ml-2 h-4 w-4" />
                              ) : null}
                            </>
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={isEditMode ? "hover:bg-blue-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}