import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Forward } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMagicLinkSignIn } from "@/lib/react-query/queries";

interface MagicLinkResponse {
    data?: any;
    error?: any;
    status?: number;
    statusTest?: string;
}

const MagicLinkSignInValidation = z.object({
    email: z.string().email(),
});

export default function MagicLinkSignIn() {

    const [error, setError] = useState<string | undefined>();
    const { mutateAsync: magicLinkSignIn } = useMagicLinkSignIn()

    const form = useForm<z.infer<typeof MagicLinkSignInValidation>>({
        resolver: zodResolver(MagicLinkSignInValidation),
        defaultValues: {
            email: "",
        },
    });

    const handleNewEmailChange = (newEmail: string) => {
        form.clearErrors("email")
        form.setValue('email', newEmail);
        setError(undefined)
    };

    const handleSignin = async (user: z.infer<typeof MagicLinkSignInValidation>) => {
        const res: MagicLinkResponse = await magicLinkSignIn({ email: user.email })
        if (res.status === 200 && res.data.status === "success") {
            form.reset()
            toast.info(res.data.message)
        } else if (res.error.error === 'User not found') {
            form.setFocus("email")
            setError(res.error.error)
        } else {
            toast.info('Something went wrong.')
        }
    };

    return (
        <>
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
                    onSubmit={form.handleSubmit(handleSignin)}
                    className="flex flex-col items-center sm:flex-row my-5"
                >
                    <div className="flex flex-row items-center mb-4 sm:mb-0 w-full sm:mr-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="block w-full px-4 py-2 h-12"
                                            {...field}
                                            onChange={(e) => handleNewEmailChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        We will email you a{" "}
                                        <span className="italic font-medium">Magic Link</span> to Sign
                                        in to your account!
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant={"outline"}
                        className="flex-shrink-0 h-12"
                    >
                        <Forward className="h-6 w-6 text-dark-4" />
                    </Button>
                </form>
            </Form>
        </>
    );
}