import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Product } from "@/types/index";

const AddToFavoritesButton = ({ product }: { product: Product }) => {
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const isProductInFavorites = favorites.some(
    (item) => item.product._id === product._id
  );

  const handleButtonClick = () =>
    isProductInFavorites ? removeFavorite(product._id!) : addFavorite(product);

  return (
    <Heart
      onClick={handleButtonClick}
      className="m-4 cursor-pointer"
      size={24}
      color={isProductInFavorites ? "#bc47ff" : "black"}
      fill={isProductInFavorites ? "#bc47ff" : "none"}
    />
  );
};

export default AddToFavoritesButton;