import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { UserType } from "@/lib/validation"
import { DataTableColumnHeader } from "../shared/data-table-column-header"
import { UserImage } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<UserType>[] = [
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
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const photo = row.getValue("photo") as UserImage
      const firstName = row.getValue("firstName") as string
      const lastName = row.getValue("lastName") as string
      return (
        photo !== undefined ?
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={photo.url}
              alt="AR"
              className="object-cover"
            />
            <AvatarFallback>{firstName.slice(0, 1)}{lastName.slice(0, 1)}</AvatarFallback>
          </Avatar>
          :
          <Avatar>
            <AvatarFallback>{firstName.slice(0, 1)}{lastName.slice(0, 1)}</AvatarFallback>
          </Avatar>
      )
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "LastName",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <div className="flex space-x-2 ml-2">
          {role === "admin" && <span className="capitalize inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">{role}</span>}
          {role === "user" && <span className="capitalize inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-800 ring-1 ring-inset ring-purple-600/20">{role}</span>}
        </div>
      )
    },
  },
]