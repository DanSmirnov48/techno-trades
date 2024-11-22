import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "@/types";
import { IPhoto } from "@/lib/axios3";
import { useGetUserSession } from "@/_auth/lib/queries";

// Initial State
export const INITIAL_PHOTO: IPhoto = {
  key: '',
  name: '',
  url: '',
};

export const INITIAL_USER: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  photo: INITIAL_PHOTO,
  role: '',
};

interface IAuthContext {
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

const defaultAuthContext: IAuthContext = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  setIsAdmin: () => { },
  checkAuthUser: async () => false,
};

const AuthContext = createContext<IAuthContext>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Session Validation Mutation
  const { mutateAsync: getSession, isPending: validating } = useGetUserSession();

  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, status } = await getSession();
      if (data && status === 'success' && !validating) {
        setUser(data);
        setIsAdmin(data.role === "admin");
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Authentication check failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value: IAuthContext = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    isAdmin,
    setIsAuthenticated,
    setIsAdmin,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used within an AuthProvider");
  }
  return context;
};
