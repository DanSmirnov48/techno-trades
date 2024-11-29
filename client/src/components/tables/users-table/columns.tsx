import { ColumnDef } from "@tanstack/react-table"
import { UserType } from "@/lib/validation"
import { DataTableColumnHeader } from "../shared/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { first } from 'lodash'

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const photo = row.getValue("photo") as string
      const firstName = row.getValue("firstName") as string
      const lastName = row.getValue("lastName") as string
      return (
        photo !== undefined ?
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={photo}
              alt="AR"
              className="object-cover"
            />
            <AvatarFallback>{first(firstName)}{first(lastName)}</AvatarFallback>
          </Avatar>
          :
          <Avatar>
            <AvatarFallback>{first(firstName)}{first(lastName)}</AvatarFallback>
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member Since" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="flex space-x-2 ml-2">
          <span>{formatDate(createdAt, "short")}</span>
        </div>
      )
    },
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