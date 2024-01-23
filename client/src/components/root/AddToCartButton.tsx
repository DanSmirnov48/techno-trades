import { Button, buttonVariants } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/index";
import { cn } from "@/lib/utils";
import Cart from "./Cart";
import { ShoppingCart } from "lucide-react";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { items, addItem } = useCart();
  const isInCart = items.some((item) => item.product._id === product._id);

  const handleClick = () => {
    if (!isInCart) {
      addItem(product);
    }
  };

  return (
    <div>
      {isInCart ? (
        <Cart
          showText={true}
          triggerStyles={cn(buttonVariants(), "w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4")}
        />
      ) : (
        <Button
          onClick={handleClick}
          disabled={product.countInStock === 0}
          size="lg"
          className={cn('w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4')}
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          <ShoppingCart
            className="ml-2"
            size={24}
            color={'#FFFFFF'}
            fill={'#FFFFFF'}
          />
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
