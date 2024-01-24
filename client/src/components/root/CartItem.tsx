import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { ImageIcon, X } from "lucide-react";

const CartItem = ({ product, qty }: { product: Product, qty: Number }) => {

  const { url } = product.image[0];
  const { removeItem } = useCart();

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-24 w-h-24 min-w-fit overflow-hidden rounded">
            {url ? (
              <img
                src={url}
                alt={product.name}
                className="absolute w-[5rem] h-[5rem] object-scale-down"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="w-10 h-10 object-scale-down text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              Quantity: {qty.toString()}
            </span>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product._id!)}
                className="flex items-center gap-0.5 text-rose-800"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.isDiscounted ? product.discountedPrice! : product.price, {currency: 'GBP'})}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
