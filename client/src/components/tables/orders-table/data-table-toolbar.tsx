import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { deliveryStatuses, paymentStatuses } from "./filters"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { DataTableFacetedFilter } from "../shared/data-table-faceted-filter"
import { DataTableViewOptions } from "../shared/data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by customer email..."
          value={(table.getColumn("customerEmail")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customerEmail")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("deliveryStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("deliveryStatus")}
            title="Delivery Status"
            options={deliveryStatuses}
          />
        )}
        {table.getColumn("paymentStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("paymentStatus")}
            title="Payment Status"
            options={paymentStatuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Icons.cancel className="ml-2 h-4 w-4" />
          </Button>
        )}

      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
