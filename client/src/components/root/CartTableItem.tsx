import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import { cn, formatPrice } from "@/lib/utils";

type props = {
  product: Product;
  qty: number;
};
export function CartTableItem({ product, qty }: props) {
  const { removeItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(qty);

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQty = Number(e.target.value);
    setQuantity(updatedQty);
    updateQuantity(product._id!, updatedQty);
  };

  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1;
    setQuantity(updatedQty);
    updateQuantity(product._id!, updatedQty);
  };

  const incrementQty = () => {
    const updatedQty = quantity + 1;
    setQuantity(updatedQty);
    updateQuantity(product._id!, updatedQty);
  };

  function ProductDetails() {
    return (
      <div key={product._id} className="flex max-w-md">
        <div className="relative h-32 w-32  border p-2 rounded-md">
          <img
            src={product.image[0].url}
            alt="product image"
            className="h-full w-full rounded-md object-contain"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col sm:ml-6 justify-center gap-1">
          <h3 className="text-lg text-black font-semibold">{product.name}</h3>
          <p className="text-base font-extralight text-black">
            {formatPrice(product.price, { currency: "GBP" })}
          </p>
        </div>
      </div>
    );
  }

  function qtyButton() {
    return (
      <div className="grid grid-cols-3 border border-gray-300 rounded-lg items-center h-12 max-w-[8rem]">
        <div className="flex justify-center cursor-pointer">
          <Minus onClick={decrementQty} />
        </div>

        <input
          type="text"
          className="text-center h-full w-full min-w-30 border-none outline-none text-lg font-bold"
          value={quantity}
          onChange={enterQty}
        />

        <div className="flex justify-center cursor-pointer">
          <Plus onClick={incrementQty} />
        </div>
      </div>
    );
  }

  function ProductRemove() {
    return (
      <Button
        aria-label="remove product"
        onClick={() => removeItem(product._id!)}
        variant="ghost"
      >
        <Trash className="h-5 w-5 text-red-500" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <>
      <TableRow key={product._id} className={cn("hover:bg-transparent")}>
        <TableCell className="px-0">{ProductDetails()}</TableCell>
        <TableCell className="px-0">{qtyButton()}</TableCell>
        <TableCell className="text-center text-base px-0">
          {formatPrice(product.price * quantity, { currency: "GBP" })}
        </TableCell>
        <TableCell className="text-right px-0">{ProductRemove()}</TableCell>
      </TableRow>
    </>
  );
}
