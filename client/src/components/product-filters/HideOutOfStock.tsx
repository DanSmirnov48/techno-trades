import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useStockFiltering } from "@/hooks/store";

const HideOutOfStock = () => {
  const { hideOutOfStock, toggleHideOutOfStock } = useStockFiltering();

  const handleSwitchChange = () => {
    toggleHideOutOfStock();
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <Switch
        id="stock"
        checked={hideOutOfStock}
        onCheckedChange={handleSwitchChange}
      />
      <Label className="font-jost text-base dark:text-light-2" htmlFor="stock">Hide out of Stock</Label>
    </div>
  );
};

export default HideOutOfStock;