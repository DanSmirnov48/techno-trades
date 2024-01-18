import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Product } from "@/types/index";
import { Button } from "../ui/button";

interface AddToFavoritesButtonProps {
  product: Product;
  variant: 'icon' | 'button';
}

const AddToFavoritesButton: React.FC<AddToFavoritesButtonProps> = ({ product, variant }) => {
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const isProductInFavorites = favorites.some((item) => item.product._id === product._id);

  const handleButtonClick = () => isProductInFavorites ? removeFavorite(product._id!) : addFavorite(product);

  const renderButton = () => {
    if (variant === 'button') {
      return (
        <Button
          size={"lg"}
          className="w-full bg-dark-1 py-6 text-white text-base"
          onClick={handleButtonClick}
        >
          {isProductInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
          <Heart
            className="ml-2"
            size={24}
            color={'#bc47ff'}
            fill={'#bc47ff'}
          />
        </Button>
      );
    } else {
      return (
        <Heart
          onClick={handleButtonClick}
          className="m-4 cursor-pointer"
          size={24}
          color={isProductInFavorites ? '#bc47ff' : 'black'}
          fill={isProductInFavorites ? '#bc47ff' : 'none'}
        />
      );
    }
  };

  return renderButton();
};

export default AddToFavoritesButton;