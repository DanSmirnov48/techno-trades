import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordValidation } from "@/lib/validation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUpdateMyPassword } from "@/lib/react-query/queries/user-queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ResetPassword = () => {

  // const { user, checkAuthUser } = useUserContext();
  const { mutateAsync: updateMyPassword, isPending } = useUpdateMyPassword()

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
    //@ts-ignore
    if (res && res.status === 401 && res.error === 'Wrong Password') {
      toast.error('Incorrect Password Provided')
      return
    }
    //@ts-ignore
    if (res && res.status === 200 && res.statusText === 'OK') {
      toast.success('Your Profile was successfully updated')
      form.reset()
    }
  };

  return (
    <Card className="px-10 max-w-[800px] text-dark-4 dark:text-white/80">
      <CardHeader className="font-semibold text-3xl mb-4">
        Update your Password
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

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Updating...
                </>
              ) : (
                <>Reset Password</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
