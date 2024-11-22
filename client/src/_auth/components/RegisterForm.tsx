import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterUser } from "../lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, RegisterValidationType } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface RegisterProps {
  setActiveTabs: React.Dispatch<React.SetStateAction<string[]>>
  setUserData: React.Dispatch<React.SetStateAction<RegisterValidationType | undefined>>
}

export default function RegisterForm({ setActiveTabs, setUserData }: RegisterProps) {
  const [error, setError] = useState<string | undefined>();
  const [type, setType] = useState<'password' | 'text'>('password');
  const { mutateAsync: createAccount, isPending: loadingUser } = useRegisterUser();
  const form = useForm<RegisterValidationType>({ resolver: zodResolver(registerSchema) })

  const handleToggle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  async function onSubmit(data: RegisterValidationType) {
    const account = await createAccount(data);
    if (account.status === 'success' && account.data) {
      setActiveTabs(['otp'])
      setUserData(data)
    } else {
      setError(account.message)
    }
  };

  return (
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
    </Fragment>
  )
};