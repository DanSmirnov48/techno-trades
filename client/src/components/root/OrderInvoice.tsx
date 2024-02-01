import { cn, formatPrice, truncateText } from "@/lib/utils";
import { Order } from "@/types/order";
import { Icons } from "../icons";

type Props = {
  order: Order;
  className?: string;
};

const OrderInvoice = ({ order, className }: Props) => {
  return (
    <div className={cn("font-jost", className)}>
      <div className="max-w-xl">
        <h1 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
          Thank you!
        </h1>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          It's on the way!
        </p>
        <p className="mt-2 text-base text-gray-500">
          Your order #{order.orderNumber} has shipped and will be with you soon.
        </p>

        <dl className="mt-12 text-sm font-medium">
          <dt className="text-gray-900">Tracking number</dt>
          <dd className="text-indigo-600 mt-2">51547878755545848512</dd>
        </dl>
      </div>

      <div className="mt-10 border-t border-gray-200">
        <h2 className="sr-only">Your order</h2>

        <h3 className="sr-only">Items</h3>

        {order.products.map(({ product, quantity }) => {
          const price = product.isDiscounted ? product.discountedPrice! : product.price
          return (
            <div key={product._id} className="py-10 border-b border-gray-200 flex space-x-6">
              <img
                className="flex-none w-20 h-20 object-center object-scale-down p-2 bg-white border-2 rounded-lg sm:w-40 sm:h-40"
                src={product.image?.[0]?.url || ''}
                alt={product.name}
              />
              <div className="flex-auto flex flex-col">
                <div>
                  <h4 className="font-medium text-gray-900">
                    <a href="#">{product.name}</a>
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {truncateText({ text: product.description, maxLength: 30 })}
                  </p>
                </div>
                <div className="mt-6 flex-1 flex items-end">
                  <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">Quantity</dt>
                      <dd className="ml-2 text-gray-700">{quantity}</dd>
                    </div>
                    <div className="pl-4 flex sm:pl-6">
                      <dt className="font-medium text-gray-900">Price</dt>
                      <dd className="ml-2 text-gray-700">
                        {formatPrice(price, { currency: "GBP" })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}

        <div className="sm:ml-40 sm:pl-6">
          <h3 className="sr-only">Your information</h3>

          <h4 className="sr-only">Addresses</h4>
          <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
            <div>
              <dt className="font-medium text-gray-900">Shipping address</dt>
              <dd className="mt-2 text-gray-700">
                <address className="not-italic">
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.name}
                  </span>
                  <span className="block">{order.shippingAddress.line1}</span>
                  <span className="block">{order.shippingAddress.line2}</span>
                  <span className="block">{order.shippingAddress.state}</span>
                  <span className="block">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postal_code}
                  </span>
                  <span className="block">{order.shippingAddress.country}</span>
                </address>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Billing address</dt>
              <dd className="mt-2 text-gray-700">
                <address className="not-italic">
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.name}
                  </span>
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.address.line1}
                  </span>
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.address.line2}
                  </span>
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.address.state}
                  </span>
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.address.city},{" "}
                    {order.paymentIntentDetails.billing_details.address.postal_code}
                  </span>
                  <span className="block">
                    {order.paymentIntentDetails.billing_details.address.country}
                  </span>
                </address>
              </dd>
            </div>
          </dl>

          <h4 className="sr-only">Payment</h4>
          <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
            <div>
              <dt className="font-medium text-gray-900">Payment method</dt>
              <dd className="mt-2 text-gray-700">
                <div className="flex flex-row gap-1 my-1">
                  <Icons.visa className="w-12 border p-1 bg-black/10" />
                  <p>
                    <span className="font-sans" aria-hidden="true">•••• </span>
                    <span className="sr-only">Ending in </span>
                    {order.paymentIntentDetails.card.last4}
                  </p>
                </div>
                <p>
                  <span aria-hidden="true">Expires </span>
                  {order.paymentIntentDetails.card.exp_month.toString().padStart(2, "0")}/
                  {order.paymentIntentDetails.card.exp_year.toString().slice(-2)}
                </p>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Shipping method</dt>
              <dd className="flex flex-col mt-2 text-gray-700 gap-1">
                <p>DHL</p>
                <p>Takes up to 3 working days</p>
              </dd>
            </div>
          </dl>

          <h3 className="sr-only">Summary</h3>

          <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-900">Subtotal</dt>
              <dd className="text-gray-700">
                {formatPrice(order.subtotal / 100, { currency: "GBP" })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-900">Shipping</dt>
              <dd className="text-gray-900">
                {formatPrice(order.shippingCost.amount_total / 100, {
                  currency: "GBP",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-900">Total</dt>
              <dd className="text-gray-900">
                {formatPrice(order.total / 100, { currency: "GBP" })}
              </dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default OrderInvoice;
