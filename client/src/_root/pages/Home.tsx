import { Link } from "react-router-dom";
import { categories } from '@/components/tables/products-table/filters'
import { NewArrivals, Promotion } from "@/components/root";
import { buttonVariants } from "@/components/ui/button";
import { useCategoryFilter } from "@/hooks/store";
import SplideCarousel from "@/components/root/SplideCarousel";

const Home = () => {
  function Hero() {
    return (
      <section className="relative overflow-hidden flex justify-center">
        <div
          className="bg-[#F3F3F3] w-full max-h-884 flex items-center rounded-3xl"
          style={{
            backgroundImage: `url(/images/hero-1.png)`,
            backgroundSize: "cover",
            backgroundPosition: "revert",
            backgroundRepeat: "no-repeat",
            height: "550px",
          }}
        >
          <div className="flex flex-col justify-center px-6 md:px-20 lg:px-30 xl:px-40 w-full max-w-[60%] gap-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Unleash Innovation in Every Byte.
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mt-2 text-dark-3 font-base">
              Explore a World of Cutting-Edge Tech
            </p>
            <Link
              to="/explore"
              className={buttonVariants({ className: "text-sm w-36" })}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    );
  }

  function ShopCategories() {
    const { toggleCategory, removeAllCategories } = useCategoryFilter();

    return (
      <>
        <div className="flex flex-row justify-between items-center my-10 font-jost">
          <h1 className="text-dark-3 text-3xl">Shop by Categories</h1>
          <Link to="/explore" className="text-lg">
            Show All
          </Link>
        </div>
        <ul className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((status, index) => (
            <li key={index}>
              <div className="flex w-full flex-col self-center overflow-hidden rounded-lg bg-[#F3F3F3]">
                <div className="relative m-6 h-40 hidden md:flex">
                  <img
                    className="w-full h-full object-scale-down"
                    src={status.image}
                    alt="post"
                  />
                </div>

                <Link to="/explore">
                  <div
                    className="flex m-6 h-16 overflow-hidden items-center justify-center rounded-xl bg-white"
                    onClick={() => { removeAllCategories(); toggleCategory(status.value) }}
                  >
                    <status.icon className="h-5 w-5 mr-3 text-muted-foreground md:hidden" />
                    <h5 className="text-xl font-medium text-dark-4 font-jost">
                      {status.label}
                    </h5>
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        {Hero()}
        <div className="my-32" />
        {SplideCarousel()}
        <div className="my-32" />
        {ShopCategories()}
        <div className="my-32" />
        <NewArrivals />
        <div className="my-32" />
        <Promotion />
        <div className="my-32" />
      </div>
    </div>
  );
};

export default Home;
