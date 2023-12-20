import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddressDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountDialog: React.FC<AddressDialogProps> = ({ setOpen }) => {

  const DeactivateAccountValidation = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  });

  const form = useForm<z.infer<typeof DeactivateAccountValidation>>({
    resolver: zodResolver(DeactivateAccountValidation),
    defaultValues: {
      password: undefined,
    },
  });

  const handleCloseAccount = async (data: z.infer<typeof DeactivateAccountValidation>) => {
    console.log(data);
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
