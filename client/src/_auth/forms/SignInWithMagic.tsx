import { toast } from "sonner";
import { IUser } from "@/types";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSendMagicLinkToken } from "@/lib/react-query/queries";

interface AuthResponse {
    data?: any;
    error?: any;
    status?: any;
}

export default function SignInWithMagic() {

    const params = useParams()
    const navigate = useNavigate();
    const { mutateAsync } = useSendMagicLinkToken()
    const { setUser, setIsAuthenticated, setIsAdmin } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            console.log(params.token);
            if (params.token) {
                try {
                    const session: AuthResponse = await mutateAsync({ token: params.token });

                    if (session.data && session.data.status === "success") {
                        const user = session.data.data.user as IUser;
                        setUser(user);
                        setIsAuthenticated(true);
                        user.role === 'admin' && setIsAdmin(true);
                        toast.success(`Nice to see you back ${user.firstName}`);
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error occurred during authentication:", error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <br />
    )
}