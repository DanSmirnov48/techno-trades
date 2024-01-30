import { CardSkeleton } from "@/components/dashboard/card-skeleton";
import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";
import { useGetMyOrders } from "@/lib/react-query/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate, formatPrice, truncateText } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function DashboardOrders() {
  const { data: orders, isLoading, isError } = useGetMyOrders();

  function showOrders() {
    return (
      <>
        {isLoading ? (
          <CardSkeleton />
        ) : isError || !orders ? (
          <p className="text-center text-red-500 font-medium py-8">
            An error occurred while fetching your orders
            <div className="flex flex-col items-center justify-start px-4 py-8 sm:px-6 md:py-12 lg:px-8 xl:pt-16">
              <div className="text-red-500 font-medium text-xl">
                An error occurred
              </div>
              <p className="mt-3 max-w-screen-md text-center text-gray-500 dark:text-gray-300">
                Please try again later.
              </p>
            </div>
          </p>
        ) : (
          <div className="">
            {orders.map((order) => (
              <Card key={order._id} className="mb-5">
                <CardHeader className="w-full rounded-t-lg bg-black/5">
                  <CardTitle>
                    <div className="flex flex-row justify-between text-base font-normal text-dark-4">
                      <div className="flex flex-row gap-14">
                        <div className="flex flex-col">
                          <p>ORDER PLACED</p>
                          <p>{formatDate(order.createdAt.toString(), "short")}</p>
                        </div>
                        <div className="">
                          <p>TOTAL</p>
                          <p>{formatPrice(order.total / 100, { currency: "GBP" })}</p>
                        </div>
                        <div className="">
                          <p>DISPATCH TO</p>
                          <p>{order.paymentIntentDetails.billing_details.name}</p>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div className="flex flex-col gap-1">
                          <p>ORDER # {order.orderNumber}</p>
                          <Button className={cn("text-blue-800/80 text-left p-0 m-0 w-fit h-5")} variant={"link"}>View order details </Button>
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="">
                    <h3 className="sr-only">Items</h3>
                    {order.products.map(({ _id, product, quantity }) => {
                      return (
                        <div key={_id} className="py-10 border-b border-gray-200 flex space-x-6">
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 w-full">
                            <div className="flex gap-4 lg:col-span-2">
                              <img
                                className="flex-none w-20 h-20 object-center object-scale-down p-2 bg-white border-2 rounded-lg sm:w-28 sm:h-28"
                                src={product.image[0].url || ""}
                                alt={product.name}
                              />
                              <div className="flex-auto flex flex-col">
                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                <div className="mt-6 flex-1 flex items-end">
                                  <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                                    <div className="flex">
                                      <dt className="font-medium text-gray-900">Quantity</dt>
                                      <dd className="ml-2 text-gray-700">{quantity}</dd>
                                    </div>
                                    <div className="pl-4 flex sm:pl-6">
                                      <dt className="font-medium text-gray-900">Price</dt>
                                      <dd className="ml-2 text-gray-700">
                                        {formatPrice(product.price, {currency: "GBP"})}
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              </div>
                            </div>
                            <div className="rounded-lg bg-gray-200"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <Shell>
      <Header
        title="Orders"
        description="View all of your purchases, invloices and order details"
        size="default"
      />
      <div className="grid gap-10">
        <Separator />
        {showOrders()}
      </div>
    </Shell>
  );
}
