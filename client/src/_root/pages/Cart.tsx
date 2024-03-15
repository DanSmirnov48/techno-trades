import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { Icons } from "@/components/shared";
import { cn, formatPrice } from "@/lib/utils";
import { CartTableItem } from "@/components/root";
import { useUserContext } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCreateOrder } from "@/lib/react-query/queries/order-queries";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Cart = () => {
  const delivery = Number(49.99);
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const cartTotal = items.reduce((total, { product, quantity }) => total + (product.isDiscounted ? product.discountedPrice! : product.price) * quantity, 0);
  const { user, isAuthenticated } = useUserContext();
  const { mutateAsync: CreateOrder } = useCreateOrder();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function checkOutHandler() {
    const order = items.map(({ product, quantity }) => {
      return {
        productId: product._id!,
        quantity: quantity,
      };
    });
    await CreateOrder({ orders: order, userId: user._id });
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <h1 className="text-xl font-bold tracking-tight text-dark-4 dark:text-white/90 sm:text-3xl">
          Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>
            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <img
                    src="images/undraw_empty_cart_co35.png"
                    className="fill"
                    alt="image"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            {isMounted && items.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className={cn("hover:bg-transparent")}>
                    <TableHead className="text-left text-base text-dark-1 dark:text-white/90 font-thin">
                      Products
                    </TableHead>
                    <TableHead className="text-left text-base text-dark-1 dark:text-white/90 font-thin">
                      Quantity
                    </TableHead>
                    <TableHead className="text-center text-base text-dark-1 dark:text-white/90 font-thin">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <CartTableItem
                      product={item.product}
                      qty={item.quantity}
                      key={item.product._id}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <section className="mt-16 rounded-lg bg-zinc-100 dark:bg-dark-4 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-dark-4 dark:text-white/90">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-sm font-medium text-dark-4 dark:text-white/90">
                  {isMounted ? (
                    formatPrice(cartTotal, { currency: "GBP" })
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Delivery</span>
                </div>
                <div className="text-sm font-medium text-dark-4 dark:text-white/90">
                  {isMounted ? (
                    formatPrice(cartTotal > 150 ? 0 : delivery, {
                      currency: "GBP",
                    })
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-muted-foreground">
                  Order Total
                </div>
                <div className="text-base font-medium text-dark-4 dark:text-white/90">
                  {isMounted ? (
                    formatPrice(
                      cartTotal + (cartTotal > 150 ? 0 : delivery),
                      { currency: "GBP" }
                    )
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isAuthenticated ? (
                <Button
                  disabled={items.length === 0}
                  className="w-full bg-dark-1 py-7 dark:text-white/90 text-lg"
                  size="lg"
                  onClick={checkOutHandler}
                >
                  <Icons.visa className="w-16 bg-light-2 rounded-md p-1.5 mr-2" />
                  Stripe Checkout 
                </Button>
              ) : (
                <Link
                  to="/sign-in"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      className: "w-full bg-dark-1 rounded-md dark:text-white/90 py-4 px-8"
                    })
                  )}
                >
                  Sign In to Checkout
                </Link>
              )}
            </div>
          </section>
        </div>

        <div className="w-full min-h-[10rem] bg-zinc-100 dark:bg-dark-4 mt-20 p-10 flex items-center justify-between font-jost rounded-xl">
          <div className="flex flex-col">
            <h1 className="font-bold text-xl mb-3">Continue shopping</h1>
            <p>
              Discover more products that are perfect for gift, for your
              wardrobe, or a unique addition to your collection.
            </p>
          </div>
          <Link
            to="/shop"
            className={cn(
              buttonVariants,
              "text-lg bg-dark-1 rounded-md text-white py-4 px-8"
            )}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;