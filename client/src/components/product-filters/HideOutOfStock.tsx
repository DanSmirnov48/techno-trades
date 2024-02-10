import { useEffect } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useLocation } from "react-router-dom";
import { useStockFiltering } from "@/hooks/store";

const HideOutOfStock = () => {
  const location = useLocation();
  const { hideOutOfStock, toggleHideOutOfStock } = useStockFiltering();

  const handleSwitchChange = () => {
    toggleHideOutOfStock();
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);

    if (hideOutOfStock) {
      urlSearchParams.set("hideOutOfStock", "true");
    } else {
      urlSearchParams.delete("hideOutOfStock");
    }

    const newUrl = `${location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  }, [hideOutOfStock]);

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