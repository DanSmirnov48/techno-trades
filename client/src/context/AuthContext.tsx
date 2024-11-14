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
import { useGetUserSession } from "@/lib/react-query/queries/user-queries";

interface AuthResponse {
  status: number;
  statusText: string;
  data: {
    data: IUser
    status: string;
    message: string;
  };
}

export const INITIAL_USER: IUser = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  photo: {
    key: '',
    name: '',
    url: '',
  },
  role: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  setIsAdmin: () => { },
  checkAuthUser: async () => false as boolean,
};

interface IContextType {
  user: IUser;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<IUser>>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: getSession, isPending: validating } = useGetUserSession()

  const checkAuthUser = async () => {
    setIsLoading(true);

    try {
      const session: AuthResponse | undefined = await getSession();
      if (session === undefined) {
        return false;
      }
      const { data, status } = session;
      if (data && status === 200 && !validating) {
        setUser({
          _id: data.data._id,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
          photo: data.data.photo,
          role: data.data.role,
        })
        data.data.role === 'admin' && setIsAdmin(true);
        setIsAuthenticated(true);
        return true;
      } else {
        console.log(data, status)
        return false;
      }
    } catch (error: any) {
      if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
        console.log('Unauthorized')
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value: IContextType = {
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

export const useUserContext = () => useContext(AuthContext);