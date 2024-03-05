import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignupValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserAccount } from "@/lib/react-query/queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthResponse {
  data?: any;
  error?: any;
  status?: number;
  statusTest?: string;
}

const SignupForm = () => {

  const navigate = useNavigate();
  const [type, setType] = useState<'password' | 'text'>('password');

  const handleToggle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

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

    toast.success(`Your Account Created Successfully!`);
    navigate("/verify-account");

    // try {
    //   const account: AuthResponse = await createAccount(user);

    //   if (account.status === 200 && account.data.status === 'success') {
    //     toast.success(`Your Account Created Successfully!`);
    //     navigate("/verify-account");
    //   }
    // } catch (error) {
    //   toast.error('Unknown Error', {
    //     description: `${error}`,
    //   })
    // }
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
                      className="block w-full px-4 py-2 h-12"
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
                      className="block w-full px-4 py-2 h-12"
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
                      className="block w-full px-4 py-2 h-12"
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
                  <div className="relative">
                    <FormControl className="flex-grow pr-10">
                      <Input type={type} maxLength={50} placeholder="Password" className="block w-full px-4 py-2 h-12" {...field} />
                    </FormControl>
                    <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                      {type === 'password' ? <Eye /> : <EyeOff />}
                    </span>
                  </div>
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
                  <div className="relative">
                    <FormControl className="flex-grow pr-10">
                      <Input type={type} maxLength={50} placeholder="Confirm Password" className="block w-full px-4 py-2 h-12" {...field} />
                    </FormControl>
                    <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                      {type === 'password' ? <Eye /> : <EyeOff />}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <Button type="submit" disabled={loadingUser} className="w-full px-6 py-3 text-lg font-medium tracking-wide text-white dark:text-dark-4 capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
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
