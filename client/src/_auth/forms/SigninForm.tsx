import * as z from "zod";
import { toast } from "sonner";
import { IUser } from "@/types";
import { useState } from "react";
import { MagicSignInForm } from ".";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SigninValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/context/AuthContext";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useSignInAccount } from "@/lib/react-query/queries/user-queries";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthResponse {
  data?: any;
  error?: any;
  status?: any;
}

const SigninForm = () => {

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
        navigate("/");
      }
    } catch (error) {
      toast.error('Unknown Error', {
        description: `Unknown Error at Sign In: ${error}`,
      })
    }
  };

  return (
    <Card className="w-full px-6 py-8 md:px-8 lg:w-1/2 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="mt-3 text-2xl text-center text-gray-600 dark:text-gray-200">Welcome back!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-10">
          <MagicSignInForm />
        </div>

        <div className="flex items-center justify-between my-6">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
          <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">or login with email & password</div>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
        </div>
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
          <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">

            <div className="mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" className="block w-full px-4 py-2 h-12" {...field} onFocus={() => setError(undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between mt-2">
                      <FormLabel className="shad-form_label">Password</FormLabel>
                      <Link to="/forgot-password" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</Link>
                    </div>
                    <div className="relative">
                      <FormControl className="flex-grow pr-10">
                        <Input type={type} maxLength={35} placeholder="Password" className="block w-full px-4 py-2 h-12" {...field} onFocus={() => setError(undefined)} />
                      </FormControl>
                      <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                        {type === 'password' ? <Eye /> : <EyeOff />}
                      </span>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6">
              <Button type="submit" disabled={loadingUser} className="w-full px-6 py-3 text-lg font-medium tracking-wide text-white dark:text-dark-4 capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                {loadingUser ? <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> : <>log in</>}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-5 mb-10">
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
        <Link to={"/sign-up"} className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or sign up</Link>
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
      </CardFooter>
    </Card>
  );
};
export default SigninForm;