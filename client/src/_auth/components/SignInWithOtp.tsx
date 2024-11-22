import { useSignInWithOtp } from "../lib/queries";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPDash,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Fragment, useState } from "react";
import { UserEmailSchemaType, otpSchema, OtpSchemaType } from "../schemas";

interface SigninWithOtpProps {
    showOTPField: boolean
    setShowOTPField: React.Dispatch<React.SetStateAction<boolean>>
    userData: UserEmailSchemaType | undefined
}

export default function SignInWithOtp({ showOTPField, setShowOTPField, userData }: SigninWithOtpProps) {
    const [error, setError] = useState<string | undefined>();
    const { mutateAsync: signInWithOtp, isPending } = useSignInWithOtp()
    const form = useForm<OtpSchemaType>({ resolver: zodResolver(otpSchema) });

    async function onSubmit(data: OtpSchemaType) {
        const response = await signInWithOtp({
            otp: data.otp,
            email: userData!.email
        });
        if (response.status === 'failure' && response.message === 'Otp is invalid or expired') {
            form.resetField('otp')
            form.setFocus('otp')
            setError(response.message)
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
                    className="flex flex-col gap-8 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        containerClassName="group flex items-center justify-center has-[:disabled]:opacity-30 my-5"
                                        render={({ slots }) => (
                                            <>
                                                <InputOTPGroup>
                                                    {slots.slice(0, 3).map((slot, index) => (
                                                        <InputOTPSlot key={index} {...slot} className="w-[67px] h-[67px]" />
                                                    ))}{" "}
                                                </InputOTPGroup>
                                                <InputOTPDash />
                                                <InputOTPGroup>
                                                    {slots.slice(3).map((slot, index) => (
                                                        <InputOTPSlot key={index + 3} {...slot} className="w-[67px] h-[67px]" />
                                                    ))}
                                                </InputOTPGroup>
                                            </>
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                {(showOTPField) && (
                                    <Fragment>
                                        <FormDescription className="py-2">
                                            We emailed you an eight-digit code to{" "}
                                            <span className="font-bold text-base">{userData?.email}</span>.
                                            Enter the code you recieved to confirm your identity and continue resetting your password.
                                        </FormDescription>
                                    </Fragment>
                                )}
                            </FormItem>
                        )}
                    />

                    <Button
                        size={"lg"}
                        type="submit"
                        disabled={isPending}
                        className="w-full px-6 py-3 text-base font-medium tracking-wide"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                Processing...
                            </>
                        ) : (
                            <>Sign In</>
                        )}
                    </Button>

                    {(showOTPField) && (
                        <div className="flex flex-col space-y-5 w-full mt-5">
                            <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                <p>Didn't recieve code?</p>
                                <Button
                                    variant={"link"}
                                    type="button"
                                    className="flex flex-row items-center text-blue-600 p-0"
                                >
                                    Resend
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </Fragment>
    );
}