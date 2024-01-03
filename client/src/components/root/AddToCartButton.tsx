import { Button, buttonVariants } from "../ui/button";
import { Product } from "@/types/index";
import { cn } from "@/lib/utils";
import Cart from "./Cart";

const AddToCartButton = ({ product }: { product: Product }) => {

  const handleClick = () => {};

  return (
    <div>
      {true ? (
        <Cart 
        showText={true} 
        triggerStyles={cn(buttonVariants(),"w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4")} 
        />
      ) : (
        <Button
          onClick={handleClick}
          size="lg"
          className={cn('w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4')}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
