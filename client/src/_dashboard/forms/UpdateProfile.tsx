import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProfileUpdateValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileUploader from "@/components/dashboard/ProfileUploader";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof ProfileUpdateValidation>>({
    resolver: zodResolver(ProfileUpdateValidation),
    defaultValues: {
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      photo: user.photo,
    },
  });

  const handleUpdate = async (
    value: z.infer<typeof ProfileUpdateValidation>
  ) => {};

  return (
    <Card className="px-10 max-w-[800px]">
      <CardHeader className="font-semibold text-3xl text-dark-4 mb-4">
        Profile Update
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-5 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                  <ProfileUploader
                      fieldChange={field.onChange}
                      media={user.photo}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="h-12" {...field} />
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
                    <Input type="text" className="h-12" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Update Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfile;
