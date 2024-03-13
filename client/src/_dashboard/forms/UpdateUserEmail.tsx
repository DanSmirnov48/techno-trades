import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPDash,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import * as z from "zod";
import { toast } from "sonner";
import { IUser } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/context/AuthContext";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { UpdateUserEmailValidation } from "@/lib/validation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRequestEmailChangeVerificationCode, useUpdateMyEmail } from "@/lib/react-query/queries";

interface EmailUpdateResponse {
    data?: {
        data?: { user: IUser },
        status?: string
    };
    error?: any;
    status?: number;
    statusText?: string;
}

const UpdateUserEmail = () => {
    const { user, checkAuthUser } = useUserContext();
    const [showOTPField, setShowOTPField] = useState(false);
    const { mutateAsync: requestVerificationCode } = useRequestEmailChangeVerificationCode()
    const { mutateAsync: updateMyEmailAddress } = useUpdateMyEmail()

    const form = useForm<z.infer<typeof UpdateUserEmailValidation>>({
        resolver: zodResolver(UpdateUserEmailValidation),
        defaultValues: {
            currentEmail: user.email,
            newEmail: "",
            pin: "",
        },
    });

    const handleNewEmailChange = (newEmail: string) => {
        form.clearErrors("newEmail")
        form.setValue('newEmail', newEmail);
        if (newEmail.trim() === '') {
            setShowOTPField(false);
        }
    };

    const requestValidationCode = async () => {
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const email = form.getValues('newEmail');
        if (email.trim() !== '' && email.match(isValidEmail)) {
            setShowOTPField(true);
            const res = await requestVerificationCode({ email: email })
        } else {
            form.setError("newEmail", {
                type: "manual",
                message: "Please enter valid email address",
            })
        }
    };

    const handleUpdate = async (value: z.infer<typeof UpdateUserEmailValidation>) => {
        const res: EmailUpdateResponse = await updateMyEmailAddress({
            code: value.pin,
            newEmail: value.newEmail
        })

        console.log({ res })
        if (res && res.status === 200 && (res.data && res.data.status === 'success')) {
            checkAuthUser()
            toast.success('Your Profile was successfully updated')
            form.reset()
            form.setValue('currentEmail', res.data.data?.user.email || '')
            setShowOTPField(false);
        } else if (res.error.error === 'Invalid verification code') {
            toast.info('Invalid verification code')
            form.setValue('pin', "")
            form.setFocus('pin')
        } else {
            toast.error('Unknown Error at Profile Update')
        }
    };

    return (
        <Card className="px-10 max-w-[800px] mt-4">
            <CardHeader className="font-semibold text-3xl text-dark-4 dark:text-white/80 mb-4">
                Update your Eamil
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdate)}
                        className="flex flex-col gap-5 w-full mt-4 max-w-5xl"
                    >
                        <FormField
                            control={form.control}
                            name="currentEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Current Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="h-12" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">New Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="h-12"
                                            {...field}
                                            onChange={(e) => handleNewEmailChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className={`transition-all duration-500 overflow-hidden ${showOTPField ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className="overflow-hidden pl-1">
                                        <FormLabel className="shad-form_label">Email Verification Code</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                autoFocus
                                                maxLength={8}
                                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                                render={({ slots }) => (
                                                    <>
                                                        <InputOTPGroup>
                                                            {slots.slice(0, 4).map((slot, index) => (
                                                                <InputOTPSlot key={index} {...slot} className="h-12 w-12" />
                                                            ))}{" "}
                                                        </InputOTPGroup>
                                                        <InputOTPDash />
                                                        <InputOTPGroup>
                                                            {slots.slice(4).map((slot, index) => (
                                                                <InputOTPSlot key={index + 3} {...slot} className="h-12 w-12" />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </>
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {(user && showOTPField) && (
                                            <>
                                                <FormDescription className="py-2">
                                                    We emailed you an eight-digit code to{" "}
                                                    <span className="font-bold text-base">{form.getValues('newEmail')}</span>.
                                                    Enter the code you recieved to confirm the email address change on your account.
                                                </FormDescription>
                                                <div className="flex flex-col space-y-5 w-full mt-5">
                                                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                                        <p>Didn't recieve code?</p>
                                                        <Button
                                                            variant={"link"}
                                                            className="flex flex-row items-center text-blue-600 p-0"
                                                        >
                                                            Resend
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        {!showOTPField && <Button type="button" onClick={requestValidationCode}>
                            Request Validation Code
                        </Button>
                        }

                        {showOTPField && <Button type="submit" disabled={false}>
                            {false ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Uploading...
                                </>
                            ) : (
                                <>Update Email</>
                            )}
                        </Button>
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UpdateUserEmail;
