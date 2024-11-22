import { toast } from "sonner";
import { useForm } from "react-hook-form"
import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Forward } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useSendPasswordResetOtp } from "../lib/queries";
import { userEmailSchema, UserEmailSchemaType } from "../schemas";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface SendPasswordResetOtpFormProps {
    activeTabs: string[]
    setActiveTabs: React.Dispatch<React.SetStateAction<string[]>>
    setUserData: React.Dispatch<React.SetStateAction<UserEmailSchemaType | undefined>>
}

export default function SendPasswordResetOtpForm({ activeTabs, setActiveTabs, setUserData }: SendPasswordResetOtpFormProps) {
    const disableField = activeTabs.includes('password')
    const [error, setError] = useState<string | undefined>();
    const { mutateAsync: sendPasswordResetOtp } = useSendPasswordResetOtp()
    const form = useForm<UserEmailSchemaType>({ resolver: zodResolver(userEmailSchema) });

    const handleNewEmailChange = (newEmail: string) => {
        form.clearErrors("email")
        form.setValue('email', newEmail);
        setError(undefined)
    };

    async function onSubmit(data: UserEmailSchemaType) {
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const email = form.getValues('email');
        if (email.trim() !== '' && email.match(isValidEmail)) {
            const resposne = await sendPasswordResetOtp({ email: email })
            if (resposne.status === 'success') {
                toast.info(resposne.message)
                setUserData(data)
                setActiveTabs(['otp', 'password'])
            }
            if (resposne.status === 'failure') {
                setError(resposne.message)
                form.setFocus('email')
            }
        } else {
            form.setError("email", {
                type: "manual",
                message: "Please enter valid email address",
            })
        }
    }

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
                    className="flex flex-col items-center sm:flex-row my-5"
                >
                    <div className="flex flex-col w-full sm:mr-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Email Address</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john.doe@email.com"
                                                className="block w-full px-4 py-2 h-12"
                                                {...field}
                                                disabled={disableField}
                                                onChange={(e) => handleNewEmailChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            variant={"outline"}
                                            className="flex-shrink-0 h-12"
                                            disabled={disableField}
                                        >
                                            <Forward className="h-6 w-6 text-dark-4" />
                                        </Button>
                                    </div>
                                    <FormMessage />

                                    {(!disableField) && (
                                        <FormDescription className="max-w-sm">
                                            We will email you a{" "}
                                            <span className="italic font-medium">One Time Password</span>{" "}
                                            to reset you account's password!
                                        </FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </Fragment>
    );
}