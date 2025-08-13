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
import { useState, useRef, useEffect, KeyboardEvent, useMemo, useCallback, memo } from "react"
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
import { ChevronDown, ChevronUp, Edit, Save, X, Plus, Trash2, ArrowUpDown, Filter } from "lucide-react"
import { calcularDataFim } from "@/utils/dateUtils"
import { MonthSelectorModal } from "@/components/ui/month-selector-modal"

interface ColumnConfig {
  key: string
  header: string
  type: 'text' | 'number' | 'select' | 'boolean' | 'currency' | 'date' | 'month-selector'
  options?: string[] | { value: string, label: string }[]
  step?: string
  placeholder?: string
  formatter?: (value: any) => string
}

interface EditableDataTableGenericProps<TData> {
  data: TData[]
  onSave: (updatedData: TData[]) => void
  onCreate?: (newItems: Partial<TData>[]) => void
  onDelete?: (id: number) => void
  columns: ColumnConfig[]
  searchKey?: string
  searchPlaceholder?: string
  initialEditMode?: boolean
  newItemTemplate?: Partial<TData>
}

export function EditableDataTableGeneric<TData extends { id: number }>({
  data,
  onSave,
  onCreate,
  onDelete,
  columns: columnConfigs,
  searchKey,
  searchPlaceholder = "Filtrar...",
  initialEditMode = false,
  newItemTemplate = {},
}: EditableDataTableGenericProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isEditMode, setIsEditMode] = useState(initialEditMode)
  const [editedData, setEditedData] = useState<TData[]>(data)
  const [currentCell, setCurrentCell] = useState<{ row: number; col: string } | null>(null)
  const [newRows, setNewRows] = useState<Partial<TData>[]>([])
  const [showSortingPanel, setShowSortingPanel] = useState(false)
  const cellRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Handler personalizado para ordenação múltipla
  const handleMultiSort = useCallback((columnId: string) => {
    if (!showSortingPanel) return;
    
    setSorting(prev => {
      const existingIndex = prev.findIndex(sort => sort.id === columnId);
      
      if (existingIndex >= 0) {
        // Se a coluna já está sendo ordenada, alterna entre asc/desc/remove
        const currentSort = prev[existingIndex];
        if (!currentSort.desc) {
          // Muda para decrescente
          const newSorting = [...prev];
          newSorting[existingIndex] = { ...currentSort, desc: true };
          return newSorting;
        } else {
          // Remove a ordenação
          return prev.filter((_, index) => index !== existingIndex);
        }
      } else {
        // Adiciona nova ordenação (crescente)
        return [...prev, { id: columnId, desc: false }];
      }
    });
  }, [showSortingPanel])

  useEffect(() => {
    setEditedData(data)
    setNewRows([]) // Reset new rows when data changes
  }, [data])

  useEffect(() => {
    setIsEditMode(initialEditMode)
  }, [initialEditMode])

  const handleCellEdit = useCallback((rowIndex: number, field: string, value: any) => {
    setEditedData(prevData => {
      const newData = [...prevData]
      const updatedRow = { ...newData[rowIndex], [field]: value }
      
      // Auto-calculate dataFim when prazoAnos or dataInicio changes
      if ((field === 'prazoAnos' || field === 'dataInicio') && (updatedRow as any).dataInicio && (updatedRow as any).prazoAnos) {
        const prazo = parseInt((updatedRow as any).prazoAnos)
        if (prazo > 0) {
          (updatedRow as any).dataFim = calcularDataFim((updatedRow as any).dataInicio, prazo)
        } else {
          (updatedRow as any).dataFim = ""
        }
      }
      
      // Clear mesesRecorrencia when frequency changes from personalizada to something else
      if (field === 'frequencia' && value !== 'personalizada' && (newData[rowIndex] as any).frequencia === 'personalizada') {
        (updatedRow as any).mesesRecorrencia = null
      }
      
      newData[rowIndex] = updatedRow
      return newData
    })
  }, [])

  const handleNewRowEdit = useCallback((rowIndex: number, field: string, value: any) => {
    setNewRows(prevRows => {
      const newRows = [...prevRows]
      if (!newRows[rowIndex]) {
        newRows[rowIndex] = { ...newItemTemplate }
      }
      const updatedRow = { ...newRows[rowIndex], [field]: value }
      
      // Auto-calculate dataFim when prazoAnos or dataInicio changes
      if ((field === 'prazoAnos' || field === 'dataInicio') && (updatedRow as any).dataInicio && (updatedRow as any).prazoAnos) {
        const prazo = parseInt((updatedRow as any).prazoAnos)
        if (prazo > 0) {
          (updatedRow as any).dataFim = calcularDataFim((updatedRow as any).dataInicio, prazo)
        } else {
          (updatedRow as any).dataFim = ""
        }
      }
      
      // Clear mesesRecorrencia when frequency changes from personalizada to something else
      if (field === 'frequencia' && value !== 'personalizada' && newRows[rowIndex] && (newRows[rowIndex] as any).frequencia === 'personalizada') {
        (updatedRow as any).mesesRecorrencia = null
      }
      
      newRows[rowIndex] = updatedRow
      return newRows
    })
  }, [editedData.length, newItemTemplate])

  const addNewRow = () => {
    setNewRows(prev => [...prev, { ...newItemTemplate }])
    setIsEditMode(true)
    // Focus on first field of new row after state update
    setTimeout(() => {
      const newRowIndex = editedData.length + newRows.length
      const firstField = fieldOrder[0]
      setCurrentCell({ row: newRowIndex, col: firstField })
      const cellKey = `new-${newRows.length}-${firstField}`
      cellRefs.current[cellKey]?.focus()
    }, 0)
  }

  const saveNewRows = async () => {
    if (onCreate && newRows.length > 0) {
      // Filter out empty rows
      const validNewRows = newRows.filter(row => {
        return Object.values(row).some(value => value !== '' && value !== null && value !== undefined)
      })
      
      if (validNewRows.length > 0) {
        console.log("Salvando novas linhas:", validNewRows)
        try {
          await onCreate(validNewRows)
          setNewRows([])
          console.log("Novas linhas salvas com sucesso")
        } catch (error) {
          console.error("Erro ao salvar novas linhas:", error)
        }
      }
    }
  }

  const fieldOrder = columnConfigs.map(col => col.key)

  const totalDataLength = editedData.length + newRows.length
  const isNewRow = (rowIndex: number) => rowIndex >= editedData.length

  const handleKeyDown = (e: KeyboardEvent, rowIndex: number, field: string) => {
    if (!isEditMode) return

    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        const currentFieldIndex = fieldOrder.indexOf(field)
        
        if (e.shiftKey) {
          if (currentFieldIndex > 0) {
            const prevField = fieldOrder[currentFieldIndex - 1]
            setCurrentCell({ row: rowIndex, col: prevField })
            setTimeout(() => {
              const cellKey = isNewRow(rowIndex) 
                ? `new-${rowIndex - editedData.length}-${prevField}`
                : `${rowIndex}-${prevField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          } else if (rowIndex > 0) {
            const lastField = fieldOrder[fieldOrder.length - 1]
            setCurrentCell({ row: rowIndex - 1, col: lastField })
            setTimeout(() => {
              const cellKey = isNewRow(rowIndex - 1)
                ? `new-${rowIndex - 1 - editedData.length}-${lastField}`
                : `${rowIndex - 1}-${lastField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          }
        } else {
          if (currentFieldIndex < fieldOrder.length - 1) {
            const nextField = fieldOrder[currentFieldIndex + 1]
            setCurrentCell({ row: rowIndex, col: nextField })
            setTimeout(() => {
              const cellKey = isNewRow(rowIndex)
                ? `new-${rowIndex - editedData.length}-${nextField}`
                : `${rowIndex}-${nextField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          } else if (rowIndex < totalDataLength - 1) {
            const firstField = fieldOrder[0]
            setCurrentCell({ row: rowIndex + 1, col: firstField })
            setTimeout(() => {
              const cellKey = isNewRow(rowIndex + 1)
                ? `new-${rowIndex + 1 - editedData.length}-${firstField}`
                : `${rowIndex + 1}-${firstField}`
              cellRefs.current[cellKey]?.focus()
            }, 0)
          } else {
            // At the end, add a new row
            addNewRow()
          }
        }
        break
      case 'Enter':
        e.preventDefault()
        if (rowIndex < totalDataLength - 1) {
          setCurrentCell({ row: rowIndex + 1, col: field })
          setTimeout(() => {
            const cellKey = isNewRow(rowIndex + 1)
              ? `new-${rowIndex + 1 - editedData.length}-${field}`
              : `${rowIndex + 1}-${field}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        } else {
          // At the end, add a new row
          addNewRow()
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        const currentFieldIndexLeft = fieldOrder.indexOf(field)
        if (currentFieldIndexLeft > 0) {
          const prevField = fieldOrder[currentFieldIndexLeft - 1]
          setCurrentCell({ row: rowIndex, col: prevField })
          setTimeout(() => {
            const cellKey = `${rowIndex}-${prevField}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        const currentFieldIndexRight = fieldOrder.indexOf(field)
        if (currentFieldIndexRight < fieldOrder.length - 1) {
          const nextField = fieldOrder[currentFieldIndexRight + 1]
          setCurrentCell({ row: rowIndex, col: nextField })
          setTimeout(() => {
            const cellKey = `${rowIndex}-${nextField}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (rowIndex > 0) {
          setCurrentCell({ row: rowIndex - 1, col: field })
          setTimeout(() => {
            const cellKey = `${rowIndex - 1}-${field}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (rowIndex < editedData.length - 1) {
          setCurrentCell({ row: rowIndex + 1, col: field })
          setTimeout(() => {
            const cellKey = `${rowIndex + 1}-${field}`
            cellRefs.current[cellKey]?.focus()
          }, 0)
        }
        break
      case 'Escape':
        setIsEditMode(false)
        setEditedData(data)
        setCurrentCell(null)
        break
    }
  }

  const renderEditableCell = useCallback((value: any, rowIndex: number, columnConfig: ColumnConfig, isNewRowCell = false) => {
    const { key: field, type, options, step, placeholder, formatter } = columnConfig
    const cellKey = isNewRowCell ? `new-${rowIndex - editedData.length}-${field}` : `${rowIndex}-${field}`
    
    if (!isEditMode) {
      if (type === 'boolean') {
        return <span>{value ? 'Sim' : 'Não'}</span>
      }
      if (type === 'currency') {
        return <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value || "0"))}</span>
      }
      if (type === 'number') {
        return <span>{value || '-'}</span>
      }
      if (type === 'date' && value) {
        return <span>{new Date(value).toLocaleDateString('pt-BR')}</span>
      }
      if (formatter) {
        return <span>{formatter(value)}</span>
      }
      return <span>{value || '-'}</span>
    }

    const commonProps = {
      onKeyDown: (e: KeyboardEvent) => handleKeyDown(e, rowIndex, field),
      className: "w-full border-0 bg-transparent focus:ring-1 focus:ring-primary",
      onFocus: (e: any) => {
        setCurrentCell({ row: rowIndex, col: field })
        // Auto-selecionar conteúdo existente para facilitar sobrescrita
        if (e.target && e.target.select) {
          setTimeout(() => e.target.select(), 0)
        }
      }
    }

    switch (type) {
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => isNewRowCell 
              ? handleNewRowEdit(rowIndex - editedData.length, field, checked)
              : handleCellEdit(rowIndex, field, checked)
            }
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => isNewRowCell 
              ? handleNewRowEdit(rowIndex - editedData.length, field, newValue)
              : handleCellEdit(rowIndex, field, newValue)
            }
          >
            <SelectTrigger 
              ref={(el) => cellRefs.current[cellKey] = el}
              {...commonProps}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => {
                if (typeof option === 'object') {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                }
                return (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )
      case 'number':
      case 'currency':
        return (
          <Input
            type="number"
            step={step || "0.01"}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => isNewRowCell 
              ? handleNewRowEdit(rowIndex - editedData.length, field, e.target.value ? parseFloat(e.target.value) : null)
              : handleCellEdit(rowIndex, field, e.target.value ? parseFloat(e.target.value) : null)
            }
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
      case 'date':
        return (
          <Input
            type="text"
            value={value || ""}
            placeholder="MM/AAAA"
            onChange={(e) => {
              let inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
              
              // Aplicar formatação automática MM/AAAA
              if (inputValue.length >= 3) {
                inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 6)}`;
              }
              
              // Limitar a 7 caracteres (MM/AAAA)
              if (inputValue.length > 7) {
                inputValue = inputValue.slice(0, 7);
              }
              
              const finalValue = inputValue.length === 7 ? inputValue : inputValue;
              
              if (isNewRowCell) {
                handleNewRowEdit(rowIndex - editedData.length, field, finalValue)
              } else {
                handleCellEdit(rowIndex, field, finalValue)
              }
            }}
            onKeyDown={(e) => {
              // Permitir navegação e backspace/delete
              if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Escape'].includes(e.key)) {
                handleKeyDown(e, rowIndex, field);
                return;
              }
              
              // Só permitir números
              if (!/\d/.test(e.key)) {
                e.preventDefault();
              }
            }}
            ref={(el) => cellRefs.current[cellKey] = el}
            className="w-full border-0 bg-transparent focus:ring-1 focus:ring-primary"
            onFocus={(e: any) => {
              setCurrentCell({ row: rowIndex, col: field })
              // Auto-selecionar conteúdo existente para facilitar sobrescrita
              if (e.target && e.target.select) {
                setTimeout(() => e.target.select(), 0)
              }
            }}
          />
        )
      case 'month-selector':
        // Get current row data to check frequency
        const currentRowData = isNewRowCell 
          ? newRows[rowIndex - editedData.length]
          : editedData[rowIndex];
        
        // Verificar frequência mais robustamente
        let isPersonalizada = false;
        if (currentRowData) {
          const freq = (currentRowData as any)?.frequencia;
          isPersonalizada = freq === 'personalizada';
        }
        
        return (
          <MonthSelectorModal
            key={`month-selector-${rowIndex}-${currentRowData?.frequencia || 'default'}`}
            value={value || ""}
            onChange={(newValue) => {
              // Ao alterar meses, também limpar se frequência não for personalizada
              const rowData = isNewRowCell 
                ? newRows[rowIndex - editedData.length]
                : editedData[rowIndex];
              
              if (rowData && (rowData as any)?.frequencia !== 'personalizada') {
                // Se frequência não é personalizada, limpar meses
                if (isNewRowCell) {
                  handleNewRowEdit(rowIndex - editedData.length, field, "");
                } else {
                  handleCellEdit(rowIndex, field, "");
                }
              } else {
                // Frequência é personalizada, salvar normalmente
                if (isNewRowCell) {
                  handleNewRowEdit(rowIndex - editedData.length, field, newValue);
                } else {
                  handleCellEdit(rowIndex, field, newValue);
                }
              }
            }}
            disabled={!isPersonalizada}
          />
        )
      default:
        return (
          <Input
            type="text"
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => isNewRowCell 
              ? handleNewRowEdit(rowIndex - editedData.length, field, e.target.value)
              : handleCellEdit(rowIndex, field, e.target.value)
            }
            ref={(el) => cellRefs.current[cellKey] = el}
            {...commonProps}
          />
        )
    }
  }, [isEditMode, editedData, newRows, handleCellEdit, handleNewRowEdit])

  const columns: ColumnDef<TData>[] = useMemo(() => {
    const dataColumns = columnConfigs.map(columnConfig => ({
      accessorKey: columnConfig.key,
      header: columnConfig.header,
      cell: ({ row }: { row: any }) => {
        const value = row.getValue(columnConfig.key);
        
        // Se não está em modo de edição, renderizar apenas o valor formatado
        if (!isEditMode) {
          // Para campos de data MM/AAAA, renderizar como string simples
          if (columnConfig.type === 'date') {
            return <div className="p-2">{value || ""}</div>;
          }
          
          // Para outros campos com formatters personalizados
          if (columnConfig.formatter) {
            return <div className="p-2">{columnConfig.formatter(value)}</div>;
          }
          
          // Para campos de moeda
          if (columnConfig.type === 'currency') {
            const numValue = parseFloat(value?.toString() || '0');
            return <div className="p-2">{numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>;
          }
          
          // Para outros tipos, renderizar valor simples
          return <div className="p-2">{value || ""}</div>;
        }
        
        // Se está em modo de edição, usar renderEditableCell
        return (
          <div className="p-2">
            {renderEditableCell(value, row.index, columnConfig)}
          </div>
        )
      },
    }));

    // Adicionar coluna de ações se estiver em modo edição e houver função de deletar
    if (isEditMode && onDelete) {
      dataColumns.push({
        id: "actions",
        header: "Ações",
        cell: ({ row }: { row: any }) => (
          <div className="p-2 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      } as any);
    }

    return dataColumns;
  }, [isEditMode, columnConfigs, onDelete])

  const table = useReactTable({
    data: editedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: true,
    enableSortingRemoval: false,
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleSave = async () => {
    // Primeiro salvar novas linhas se existirem
    if (onCreate && newRows.length > 0) {
      const validNewRows = newRows.filter(row => {
        return Object.values(row).some(value => value !== '' && value !== null && value !== undefined)
      })
      
      if (validNewRows.length > 0) {
        try {
          await onCreate(validNewRows)
          setNewRows([])
        } catch (error) {
          console.error("Erro ao salvar novas linhas:", error)
          return // Não continuar se falhar
        }
      }
    }

    // Depois salvar as edições existentes
    const validData = editedData.filter(item => item && item.id)
    
    if (validData.length > 0) {
      try {
        await onSave(validData)
      } catch (error) {
        console.error("Erro no onSave:", error)
        return
      }
    }
    
    setIsEditMode(false)
    setCurrentCell(null)
  }

  const handleCancel = () => {
    setEditedData(data)
    setIsEditMode(false)
    setCurrentCell(null)
  }

  const handleDelete = (id: number) => {
    // A confirmação será feita na página específica (receitas, despesas, etc.)
    if (onDelete) {
      onDelete(id);
    }
  }

  // Define larguras das colunas no modo edição
  const getColumnWidth = (columnKey: string) => {
    switch (columnKey) {
      case 'descricao':
        return 'min-w-[200px]'
      case 'valor':
        return 'min-w-[120px]'
      case 'categoria':
      case 'frequencia':
      case 'membro':
        return 'min-w-[140px]'
      case 'dataInicio':
      case 'dataFim':
      case 'prazoAnos':
        return 'min-w-[100px]'
      case 'mesesRecorrencia':
        return 'min-w-[120px]'
      case 'ativo':
        return 'min-w-[80px]'
      case 'actions':
        return 'min-w-[80px]'
      default:
        return 'min-w-[100px]'
    }
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
          {!isEditMode && (
            <>
              <Button
                onClick={() => setShowSortingPanel(!showSortingPanel)}
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenação Múltipla
              </Button>
              <Button
                onClick={() => setIsEditMode(true)}
                size="sm"
                className="bg-primary hover:bg-primary-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Tabela
              </Button>
            </>
          )}
          {isEditMode && (
            <>
              {onCreate && (
                <Button
                  onClick={addNewRow}
                  size="sm"
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Linha
                </Button>
              )}

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
                Salvar{newRows.length > 0 ? ` Tudo (${newRows.length} novas)` : ' Tudo'}
              </Button>
            </>
          )}
        </div>
      </div>

      {showSortingPanel && !isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-900">Ordenação Múltipla</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSorting([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpar Tudo
            </Button>
          </div>
          
          <div className="space-y-2">
            {sorting.length === 0 ? (
              <p className="text-sm text-blue-600">
                ✨ <strong>Modo Ativo!</strong> Clique nos cabeçalhos das colunas para adicionar múltiplos critérios de ordenação
              </p>
            ) : (
              sorting.map((sort, index) => {
                const column = columnConfigs.find(col => col.key === sort.id);
                return (
                  <div key={sort.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full min-w-[20px] text-center">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">
                      {column?.header || sort.id}
                    </span>
                    <span className="text-sm text-gray-600">
                      {sort.desc ? 'Decrescente' : 'Crescente'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSorting(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
          

        </div>
      )}

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <strong>Modo de Edição Ativado:</strong> Use Tab/Shift+Tab para navegar entre campos, Enter/Setas para navegar entre linhas, Esc para cancelar.
        </div>
      )}

      <div className={`rounded-md border bg-white ${isEditMode ? 'ring-2 ring-primary ring-opacity-50' : ''} ${isEditMode ? 'overflow-x-auto' : ''}`}>
        <Table className={isEditMode ? 'min-w-[1200px]' : ''}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`font-semibold ${isEditMode ? getColumnWidth(header.id) : ''}`}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort() && !isEditMode
                              ? "cursor-pointer select-none flex items-center"
                              : "flex items-center"
                          }
                          onClick={!isEditMode ? (showSortingPanel ? () => handleMultiSort(header.column.id) : header.column.getToggleSortingHandler()) : undefined}
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
              <>
                {table.getRowModel().rows.map((row) => (
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
                ))}
                {/* Render new rows */}
                {isEditMode && newRows.map((newRow, newRowIndex) => (
                  <TableRow
                    key={`new-${newRowIndex}`}
                    className="bg-green-50 hover:bg-green-100 border-t-2 border-green-200"
                  >
                    {columnConfigs.map((columnConfig) => (
                      <TableCell key={columnConfig.key} className="p-0">
                        <div className="p-2">
                          {renderEditableCell(
                            (newRow as any)[columnConfig.key], 
                            editedData.length + newRowIndex, 
                            columnConfig, 
                            true
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
                {/* Render new rows even when no existing data */}
                {isEditMode && newRows.map((newRow, newRowIndex) => (
                  <TableRow
                    key={`new-${newRowIndex}`}
                    className="bg-green-50 hover:bg-green-100 border-t-2 border-green-200"
                  >
                    {columnConfigs.map((columnConfig) => (
                      <TableCell key={columnConfig.key} className="p-0">
                        <div className="p-2">
                          {renderEditableCell(
                            (newRow as any)[columnConfig.key], 
                            editedData.length + newRowIndex, 
                            columnConfig, 
                            true
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}