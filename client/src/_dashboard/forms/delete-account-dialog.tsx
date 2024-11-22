import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeactivateMyAccount } from "@/lib/react-query/queries/user-queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogoutUser } from "@/_auth/lib/queries";

interface AddressDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountDialog: React.FC<AddressDialogProps> = ({ setOpen }) => {

  const navigate = useNavigate();
  const { mutate: signOut } = useLogoutUser();
  const {mutateAsync: deactivateMyAccount} = useDeactivateMyAccount()

  const DeactivateAccountValidation = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  });

  const form = useForm<z.infer<typeof DeactivateAccountValidation>>({
    resolver: zodResolver(DeactivateAccountValidation),
    defaultValues: {
      password: undefined,
    },
  });

  const handleCloseAccount = async () => {
    let res = await deactivateMyAccount()
    if(res && res.status === 204){
      signOut();
      navigate("/");
    }
    setOpen(false);
  };

  return (
    <>
      <div className="font-semibold text-dark-4 text-lg">
        Deactivate Your Account
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCloseAccount)}
          className="flex flex-col gap-5 w-full mt-4 space-y-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Close Account</Button>
        </form>
      </Form>
    </>
  );
};

export default DeleteAccountDialog;
