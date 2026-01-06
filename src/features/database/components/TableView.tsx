import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/button'
import {
  useProperties,
  useRows,
  useCreateRow,
  useUpdateRow,
  useDeleteRow,
  type DatabaseRow,
  type PropertyWithOptions,
} from '../api/queries'

interface TableViewProps {
  databaseId: string
}

export function TableView({ databaseId }: TableViewProps) {
  const { data: properties = [] } = useProperties(databaseId)
  const { data: rows = [], isLoading } = useRows(databaseId)
  const createRow = useCreateRow(databaseId)
  const updateRow = useUpdateRow(databaseId)
  const deleteRow = useDeleteRow(databaseId)

  // 동적 컬럼 생성
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<DatabaseRow>()

    const cols: ColumnDef<DatabaseRow, unknown>[] = properties.map((prop) => {
      return columnHelper.accessor((row) => row.values[prop.id], {
        id: prop.id,
        header: prop.name,
        cell: ({ getValue, row: tableRow }) => (
          <EditableCell
            value={getValue()}
            property={prop}
            onSave={(value) => {
              updateRow.mutate({
                rowId: tableRow.original.id,
                values: { [prop.id]: value },
              })
            }}
          />
        ),
      })
    })

    // 삭제 버튼 컬럼
    cols.push(
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row: tableRow }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={() => deleteRow.mutate(tableRow.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5 text-neutral-400 hover:text-red-500" />
          </Button>
        ),
      })
    )

    return cols
  }, [properties, updateRow, deleteRow])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <div className="py-8 text-center text-neutral-400">로딩 중...</div>
  }

  return (
    <div className="w-full">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group hover:bg-neutral-50 dark:hover:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 새 행 추가 버튼 */}
      <button
        className="flex items-center gap-2 w-full px-3 py-2 mt-1 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
        onClick={() => createRow.mutate({})}
        disabled={createRow.isPending}
      >
        <Plus className="h-4 w-4" />
        New
      </button>
    </div>
  )
}

// ===== Editable Cell Component =====
interface EditableCellProps {
  value: unknown
  property: PropertyWithOptions
  onSave: (value: unknown) => void
}

function EditableCell({ value, property, onSave }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value ?? ''))

  function handleBlur() {
    setIsEditing(false)
    if (editValue !== String(value ?? '')) {
      onSave(property.type === 'title' || property.type === 'text' ? editValue : editValue)
    }
  }

  // Select 타입
  if (property.type === 'select' && property.options) {
    return (
      <select
        value={String(value ?? '')}
        onChange={(e) => onSave(e.target.value)}
        className="w-full bg-transparent text-sm outline-none cursor-pointer"
      >
        <option value="">-</option>
        {property.options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    )
  }

  // Date 타입
  if (property.type === 'date') {
    return (
      <input
        type="date"
        value={String(value ?? '')}
        onChange={(e) => onSave(e.target.value)}
        className="w-full bg-transparent text-sm outline-none"
      />
    )
  }

  // Text/Title 타입
  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        className="w-full bg-transparent text-sm outline-none"
        autoFocus
      />
    )
  }

  return (
    <div
      className={cn(
        'min-h-[24px] text-sm cursor-text',
        property.type === 'title' && 'font-medium'
      )}
      onClick={() => setIsEditing(true)}
    >
      {String(value ?? '') || <span className="text-neutral-300">-</span>}
    </div>
  )
}
