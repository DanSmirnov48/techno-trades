import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { SigninForm } from "@/_auth/forms";
import { useEffect, useState } from "react";
import { Icons } from "@/components/shared";
import { cn, formatPrice } from "@/lib/utils";
import { CartTableItem } from "@/components/root";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Cart = () => {
  const delivery = Number(49.99);
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const cartTotal = items.reduce((total, { product, quantity }) => total + (product.isDiscounted ? product.discountedPrice! : product.price) * quantity, 0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-xl">
        <h1 className="text-xl font-bold tracking-tight text-dark-4 dark:text-white/90 sm:text-3xl text-center mb-5">
          Your Cart ({items.length}) items
        </h1>
        <div>
          <h2 className="sr-only">Items in your shopping cart</h2>
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

        <section className="max-w-xl ml-auto mt-16 rounded-lg bg-accent dark:bg-dark-4 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8">
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
                <span>Shipping</span>
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
            {true ? (
              <Link
                className={cn(
                  buttonVariants({
                    className: "w-full bg-dark-1 py-7 dark:text-white/90 text-lg",
                    size: "lg",
                  }),
                )}
                to="/checkout"
              >
                <Icons.visa className="w-16 bg-light-2 rounded-md p-1.5 mr-2" />
                Checkout
              </Link>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="w-full">
                  <Button size={"lg"} className="w-full bg-dark-1 rounded-md dark:text-white/90 py-4 px-8">
                    Sign In to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl w-full px-6 py-12 md:px-12 lg:w-1/2 rounded-xl shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="mt-3 text-2xl text-center text-gray-600 dark:text-gray-200">Welcome back!</DialogTitle>
                  </DialogHeader>
                  <SigninForm returnAs={"form"} withMagicSignIn={false} setOpen={setOpen} />
                  <DialogFooter className="flex items-center sm:justify-center my-3">
                    <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                    <Link to={"/sign-up"} className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or sign up</Link>
                    <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>

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