import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { categories } from "./filters"
import { DataTableRowActions } from "./data-table-row-actions"
import { ProductType } from "@/lib/validation"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "../shared/data-table-column-header"

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = categories.find(
        (category) => category.value === row.getValue("category")
      )

      if (!category) {
        return null
      }

      return (
        <div className="flex w-[130px] items-center pl-1">
          {category.icon && (
            <category.icon className="mr-2 h-6 w-6 text-muted-foreground" />
          )}
          <span>{category.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const lowStock = Number(row.getValue("countInStock")) < 10

      return (
        <div className="flex space-x-2">
          {lowStock && <Badge variant="destructive">Low Stock</Badge>}
          <span className="max-w-[280px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GBP",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "countInStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const countInStock = parseFloat(row.getValue("countInStock"))
      const formatted = new Intl.NumberFormat("en-US").format(countInStock)

      return <div className="max-w-[50px] truncate font-medium text-center">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row}/>
  },
]