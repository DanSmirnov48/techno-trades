import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useUserStore } from "@/hooks/store";
import { Shell } from "@/components/dashboard/shell";
import { Link, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

const AccountVerified = () => {
    const user = useUserStore(state => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user]);

    return (
        <Shell className="flex items-center justify-center">
            <Card className="flex flex-col items-center justify-center overflow-hidden p-10 gap-3 max-w-xl">
                <CardHeader>
                    <CardTitle>
                        Thank you {user?.firstName} {user?.lastName}!
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row gap-3 items-center justify-center">
                    <img src="/images/verified.png" className="w-20 h-20 object-cover" />
                    <p className="text-2xl">
                        You have successfully verified your account.
                    </p>
                </CardContent>
                <CardFooter className="w-full">
                    <Link
                        to="/sign-in"
                        className={cn(
                            buttonVariants({
                                size: "lg",
                                className: "w-full",
                            })
                        )}
                    >
                        Sign In to your Account
                    </Link>
                </CardFooter>
            </Card>
        </Shell>
    );
};

export default AccountVerified;
