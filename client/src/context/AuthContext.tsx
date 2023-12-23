import { useNavigate } from "react-router-dom";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from 'js-cookie';
import { IUser } from "@/types";
import { useValidateUserByJwt } from "@/lib/react-query/queries";

interface AuthResponse {
  status: number;
  statusText: string;
  data?: {
    user: IUser;
  };
}

export const INITIAL_USER = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  photo: {
    key: "",
    name: "",
    url: "",
  },
  role: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: validateJWT, isPending: validating } = useValidateUserByJwt()

  const checkAuthUser = async () => {
    const jwt = Cookies.get('jwt');
    setIsLoading(true);

    try {
      if (jwt) {
        const { data, status }: AuthResponse = await validateJWT(jwt);
        if (data && status === 200 && !validating) {
          setUser({
            _id: data.user._id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            photo: data.user.photo,
            role: data.user.role,
          })
          data.user.role === 'admin' && setIsAdmin(true);
          setIsAuthenticated(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error in checkAuthUser:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    isAdmin,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);