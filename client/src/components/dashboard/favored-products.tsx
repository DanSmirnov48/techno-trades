import { buttonVariants } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "react-router-dom";
import { GridProductList } from "../root";

const FavoredProducts = () => {
  const { favorites } = useFavorites();
  const products = favorites.map((p) => p.product)
  const itemCount = favorites.length;

  return (
    <div>
      {itemCount > 0 ? <GridProductList products={products} /> : (
        <div className="flex h-full flex-col items-center justify-center space-y-1">
          <div
            aria-hidden="true"
            className="relative mb-4 h-96 w-96 text-muted-foreground"
          >
            <img
              src="/images/undraw_Love_it_xkc2.png"
              className="fill"
              alt="image"
            />
          </div>
          <div className="text-xl font-semibold z-30 !mt-14">
            You don't have any products favored yet!
          </div>
          <Link
            to="/explore"
            className={buttonVariants({
              variant: "link",
              size: "sm",
              className: "text-sm text-muted-foreground underline",
            })}
          >
            Let's fix that
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoredProducts;
