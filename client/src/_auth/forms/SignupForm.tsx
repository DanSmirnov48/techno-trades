import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";
import { useCreateUserAccount } from "@/lib/react-query/queries";
import { cn } from "@/lib/utils";
import { IUser } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface AuthResponse {
  data?: any;
  error?: any;
  status?: any;
}

const SignupForm = () => {

  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutateAsync: createAccount, isPending: loadingUser } = useCreateUserAccount();

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const account: AuthResponse = await createAccount(user);
      
      const isUser = await checkAuthUser();
      if (account.data && account.data.status === "success" && isUser) {
        const user = account.data.data.user as IUser
        toast.success(`Welcome, ${user.firstName}. Happy shopping!`)
        navigate("/");
      }
    } catch (error) {
      toast.error('Unknown Error', {
        description: `${error}`,
      })
    }
  };

  // flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-xl shadow-lg dark:bg-gray-800 lg:max-w-4xl
  return (
    <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 rounded-xl shadow-lg">
      <div className="flex justify-center mx-auto">
        <img className="w-auto h-7 sm:h-8" src="" alt="" />
      </div>

      <h2 className="text-xl text-center text-gray-600 dark:text-gray-200">
        Create a new account
      </h2>
      <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-200">
        To use our shop, Please enter your details
      </p>

      <Link
        to={""}
        className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <Icons.google className="w-6 h-6" />
        <span className="w-5/6 px-4 py-3 font-bold text-center">
          Sign up with Google
        </span>
      </Link>

      <div className="flex items-center justify-between mt-6">
        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

        <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
          or register with email
        </div>

        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
      </div>

      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Doe"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@email.com"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <Button type="submit" disabled={loadingUser} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                {loadingUser ? <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> : <>Sign Up</>}
              </Button>
            </div>
          </form>
        </div>
      </Form>

      <div className="flex items-center justify-between mt-5 mb-10">
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
        <Link
          to={"/sign-in"}
          className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
        >
          or sign in
        </Link>
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
      </div>
    </div>
  );
};

export default SignupForm;
