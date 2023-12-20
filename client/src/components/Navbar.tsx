import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { LogIn } from "lucide-react";
import { UserNav } from "./UserNav";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <header className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-light-1 backdrop-blur-lg transition-all">
      <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-10 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-4 md:gap-6">
          <Link to="/" className="flex z-40 font-bold text-lg">
            <span>ProShop</span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center text-sm font-medium text-muted-foreground"
          >
            <span>Explore</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <>
              {isAuthenticated ? (
                <>
                  <UserNav />
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
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