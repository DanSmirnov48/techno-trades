import * as z from "zod";
import { toast } from "sonner";
import { IUser } from "@/types";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SigninValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/context/AuthContext";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useSignInAccount } from "@/lib/react-query/queries/user-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthResponse {
  data?: any;
  error?: any;
  status?: any;
}

interface SigninFormProps {
  returnAs: "card" | "form";
  withMagicSignIn?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const SigninForm: React.FC<SigninFormProps> = ({ returnAs = "card", withMagicSignIn, setOpen }) => {

  const navigate = useNavigate();
  const { setUser, setIsAuthenticated, setIsAdmin } = useUserContext();

  const [type, setType] = useState<'password' | 'text'>('password');
  const [error, setError] = useState<string | undefined>();

  const handleToggle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  const { mutateAsync: signInAccount, isPending: loadingUser } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const session: AuthResponse = await signInAccount(user);

      if (session.error && session.error.error === "Incorrect email or password") {
        setError(session.error.error)
      }
      if (session.data && session.data.status === "success") {
        const user = session.data.data.user as IUser
        setUser(user)
        setIsAuthenticated(true)
        user.role === 'admin' && setIsAdmin(true);
        toast.success(`Nice to see you back ${user.firstName}`)
        if (returnAs === "form" && setOpen) {
          setOpen(false)
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error('Unknown Error', {
        description: `Unknown Error at Sign In: ${error}`,
      })
    }
  };

  const formContent = (
    <Fragment>
      {error &&
        <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span className="sr-only">Info</span>
          <div className="text-base">
            <span className="font-medium">{error}</span>
          </div>
        </div>
      }

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full font-jost">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@email.com" className="block w-full px-4 py-2 h-12" {...field} onFocus={() => setError(undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Password</FormLabel>
                  <div className="relative">
                    <FormControl className="flex-grow pr-10">
                      <Input type={type} maxLength={35} placeholder="Password" className="block w-full px-4 py-2 h-12" {...field} onFocus={() => setError(undefined)} />
                    </FormControl>
                    <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                      {type === 'password' ? <Eye /> : <EyeOff />}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-black/60 dark:text-gray-300 hover:underline">Reset password</Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" size={"lg"} disabled={loadingUser} className="w-full text-lg font-medium tracking-wide mt-3">
            {loadingUser ?
              <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> :
              <>Sign in</>}
          </Button>
        </form>
      </Form>
    </Fragment>
  )

  if (returnAs === "card") {
    return (
      // <Card className="w-full px-6 py-8 md:px-8 lg:w-1/2 border-none bg-none shadow-none">
      <Card className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        <CardHeader className="flex gap-5 p-5">
          <CardTitle className="flex flex-row justify-center">
            <img src="/logo.ico" alt="" className="w-10 mr-2" />
            <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
          </CardTitle>
          <h1 className="text-2xl text-center font-jost">
            Welcome back!
          </h1>
        </CardHeader>
        <CardContent>
          {formContent}
        </CardContent>
      </Card>
    );
  } else {
    return formContent;
  }
};
export default SigninForm;