import { toast } from "sonner"
import { ListRestart, X } from "lucide-react"
import { ProductType } from "@/lib/validation"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { categories } from '../products-table/filters'
import { DataTableColumnHeader } from "../shared/data-table-column-header"
import { useRestoreProduct } from "@/lib/react-query/queries/product-queries"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
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
    cell: ({ row }) => {
      const { mutateAsync: restoreProduct } = useRestoreProduct();
      const id = row.getValue("_id") as string

      async function handleEvent() {
        const res = await restoreProduct({ id });
        toast.success(res.message)
      }

      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <ListRestart onClick={handleEvent} className="cursor-pointer w-8 h-8" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore Product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
]