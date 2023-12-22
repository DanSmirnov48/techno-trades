import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { UpdatePasswordValidation } from "@/lib/validation";
import { useUpdateMyPassword } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // const { user, checkAuthUser } = useUserContext();
  const { mutateAsync: updateMyPassword } = useUpdateMyPassword()

  const form = useForm<z.infer<typeof UpdatePasswordValidation>>({
    resolver: zodResolver(UpdatePasswordValidation),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const handlePasswordUpdate = async (value: z.infer<typeof UpdatePasswordValidation>) => {
    let user = ({
      passwordCurrent: value.currentPassword,
      password: value.newPassword,
      passwordConfirm: value.newPasswordConfirm
    })
    let res = await updateMyPassword(user)
    console.log(res)
    if(res && res.status === 401 && res.error.error === 'Wrong Password'){
      toast({
        title: "Incorrect Password Provided",
        variant: "destructive",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-bold"
        ),
        duration: 3000,
      });
      return
    }
    if(res && res.status === 200 && res.statusText === 'OK'){
      console.log(res.data.data.user._id)
      toast({
        title: "Success",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 text-xl font-semibold bg-green-300 border-none"
        ),
        description: `Your Profile was successfully updated`,
        duration: 5000,
      });
      form.reset()
    }
  };

  return (
    <Card className="px-10 max-w-[800px]">
      <CardHeader className="font-semibold text-3xl text-dark-4 mb-4">
        password1234
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordUpdate)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Current Pasword
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPasswordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Reset Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
