import { Order } from "@/types/order"
import { formatPrice } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type RecentSalesProps = {
  orders: Order[]
};

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order._id} className="flex items-center">
          <Avatar className="h-10 w-10 object-scale-down">
            <AvatarImage src={order.user.photo && order.user.photo.url} alt="Avatar" />
            <AvatarFallback>{order.user.firstName.slice(0, 1)}{order.user.lastName.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.user.firstName} {order.user.lastName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          </div>
          <div className="ml-auto font-medium">+{formatPrice(order.total / 100, { currency: "GBP" })}</div>
        </div>
      ))}
    </div>
  )
}