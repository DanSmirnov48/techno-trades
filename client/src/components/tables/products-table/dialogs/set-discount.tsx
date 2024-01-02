import { ProductType } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useSetProductDiscount } from "@/lib/react-query/queries";

type EditProps = {
  product: ProductType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SetDiscount({ product, setOpen }: EditProps) {
  const [discount, setDiscount] = useState<number>();
  const { mutateAsync: setProductDiscount } = useSetProductDiscount()

  const StatBox = ({ label, value }: { label: string; value: string }) => (
    <Button
      onClick={() => setDiscount(Number(value))}
      className={cn(
        "border h-16 bg-white hover:bg-neutral-200 border-gray-200 p-4 rounded-lg min-w-[100px] w-full text-center text-dark-4"
      )}
    >
      <div className="flex gap-1">
        <h4 className="font-extrabold text-2xl">{value}</h4>
        <p>{label}</p>
      </div>
    </Button>
  );

  function handleSubmit() {

    const discountedPrice = discount && product.price - (product.price * discount) / 100;

    let res = setProductDiscount({
      id: product._id,
      isDiscounted: !product.isDiscounted,
      discountedPrice: discountedPrice,
    })
    console.log(res)
    setOpen(false)
  }

  return (
    <div className="flex flex-col w-full max-w-[700px] mx-auto gap-5 my-5">
      <h1 className="body-bold">Set {product.name} for discount!</h1>
      <h1>Choose one of:</h1>
      <div>
        <ul className="grid grid-cols-4 gap-5">
          <StatBox label="%" value="10" />
          <StatBox label="%" value="20" />
          <StatBox label="%" value="30" />
          <StatBox label="%" value="50" />
        </ul>
      </div>

      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-px my-8 bg-gray-300 border-0 dark:bg-gray-700" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
      </div>

      <Label htmlFor="inputs">Enter Manually</Label>
      <Input
        id="input"
        placeholder="Discount %"
        type="number"
        onChange={(e) => setDiscount(Number(e.target.value.slice(0, 2)))}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
