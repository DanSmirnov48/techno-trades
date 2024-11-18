import { Cart } from ".";
import { UserNav } from "./UserNav";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <header className="sticky h-20 inset-x-0 top-0 z-30 w-full bg-light-1 dark:bg-dark-2 transform duration-700 ease-in-out border-b border-gray-200 bg-background backdrop-blur-lg transition-all">
      <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-10 flex h-20 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-4 md:gap-6">
          <Link to="/" className="flex z-40 items-center justify-evenly select-none font-semibold font-jost text-lg text-dark-4 dark:text-light-2 duration-700 ease-in-out">
            <img src="/logo.ico" alt="" className="w-10 mr-2"/><span>TechnoTrades</span>
          </Link>

          <Link
            to="/explore"
            className="flex items-center text-sm font-medium text-muted-foreground"
          >
            <span>Explore</span>
          </Link>
          <Link
            to="/deals"
            className="flex items-center text-sm font-medium text-muted-foreground"
          >
            <span>Epic Deals</span>
          </Link>
          <Link
            to="/popular-brands"
            className="flex items-center text-sm font-medium text-muted-foreground"
          >
            <span>Popular Brands</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <>
            <ThemeToggle />
            <Cart />
              {isAuthenticated ? (
                <>
                  <UserNav />
                </>
              ) : (
                <>
                  <Link
                    to="/auth/sign-in"
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Log In <LogIn className="ml-1.5 h-5 w-5" />
                  </Link>
                </>
              )}
            </>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;