import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignupValidation } from "@/lib/validation";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserAccount } from "@/lib/react-query/queries/user-queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AuthResponse {
  data?: any;
  error?: any;
  status?: number;
  statusTest?: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setUserProducts } = useUserStore()
  const [type, setType] = useState<'password' | 'text'>('password');
  const { mutateAsync: createAccount, isPending: loadingUser } = useCreateUserAccount();
  const form = useForm<z.infer<typeof SignupValidation>>({ resolver: zodResolver(SignupValidation) });

  const handleToggle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const account: AuthResponse = await createAccount(user);

      if (account.status === 200 && account.data.status === 'success') {
        setUserProducts(user)
        toast.success(`Your Account Created Successfully!`);
        navigate("/verify-account");
      }
    } catch (error) {
      toast.error('Unknown Error', {
        description: `${error}`,
      })
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignup)}
        className="flex flex-col gap-5 w-full font-jost"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John" className="block w-full px-4 py-2 h-12"   {...field} />
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
              <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Doe" className="block w-full px-4 py-2 h-12"{...field} />
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
              <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@email.com" className="block w-full px-4 py-2 h-12" {...field} />
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
              <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Password</FormLabel>
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
              <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Password Confirm</FormLabel>
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
          <Button type="submit" size={"lg"} disabled={loadingUser} className="w-full text-lg font-medium tracking-wide mt-3">
            {loadingUser ? <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> : <>Sign Up</>}
          </Button>
        </div>
      </form>
    </Form>
  )
};