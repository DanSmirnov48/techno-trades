import { Heart } from "lucide-react";
import { Product } from "@/types/index";

const AddToFavoritesButton = ({ product }: { product: Product }) => {

  const handleButtonClick = () => {}

  return (
    <Heart
      onClick={handleButtonClick}
      className="m-4 cursor-pointer"
      size={24}
    />
  );
};

export default AddToFavoritesButton;