import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";

interface CartProps {
  triggerStyles?: string;
  showText?: boolean;
}

const Cart: React.FC<CartProps> = ({ triggerStyles, showText = false }) => {
  const delivery = Number(49.99);
  const { items } = useCart();
  const itemCount = items.length;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const cartTotal = items.reduce((total, { product, quantity }) => total + (product.isDiscounted ? product.discountedPrice! : product.price) * quantity, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderTriggerContent = () => {
    if (showText) {
      return (
        <div className={cn(buttonVariants(), "w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4")}>
          View in Cart
        </div>
      );
    } else {
      return (
        <span className="relative inline-block mt-1">
          <ShoppingCart aria-hidden="true" className="w-6 h-6 text-gray-700 fill-current dark:text-light-2" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1.5 text-sm font-bold leading-none text-dark-4 transform translate-x-1/2 -translate-y-1/2 bg-purple-400/70 rounded-full">
            {isMounted ? itemCount : 0}
          </span>
        </span>
      );
    }
  };

  return (
    <Sheet>
      <SheetTrigger className={cn("group flex items-center p-2", triggerStyles)}>
        {renderTriggerContent()}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map((item) => (
                  <CartItem product={item.product} qty={item.quantity} key={item.product._id} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>{cartTotal > 150 ? "Free" : delivery}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal, { currency: 'GBP' })}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    to="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <img
                src="images/undraw_empty_cart_co35.png"
                className="fill"
                alt="image"
              />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                to="/shop"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground underline",
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
