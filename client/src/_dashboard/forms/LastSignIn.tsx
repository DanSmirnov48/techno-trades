import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

const LastSignIn = () => {

  const lastSignIn = Cookies.get('lastSignInTime');
  const { user } = useUserContext();
  return (
    <Card className="my-4 p-1 max-w-[800px] text-dark-4 dark:text-muted-foreground">
      <CardHeader className="text-left w-full rounded-lg">
        <CardTitle className="font-extralight text-lg leading-loose">
          Last Sign In was on: <span className="font-medium text-2xl tracking-wide">{lastSignIn && formatDate(lastSignIn)}</span>
        </CardTitle>
        <CardDescription className="text-xl font-light tracking-wide">
          If this wasn't you, please
          <Link
            className="underline ml-2"
            to={`/dashboard/account/${user._id}?tab=password`}>Update your password!</Link>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default LastSignIn;