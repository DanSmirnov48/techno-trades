import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPDash,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { z } from "zod"
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ForgotPasswordValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Input } from "@/components/ui/input";
import {
    useRequestForgotPasswordVerificationCode,
    useResetForgottenPassword,
    useVerifyPasswordResetVerificationDoe
} from "@/lib/react-query/queries/user-queries";

interface ForgotPasswordResponse {
    data?: any;
    error?: any;
    status?: number;
    statusTest?: string;
}

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [type, setType] = useState<'password' | 'text'>('password');

    const [showOTPField, setShowOTPField] = useState(false);
    const [showPasswordFields, setShowPasswordFiels] = useState(false);
    const [showPasswordResetCancel, setShowPasswordResetCanel] = useState(false);

    const { mutateAsync: verifyPasswordResetCode } = useVerifyPasswordResetVerificationDoe()
    const { mutateAsync: requestForgotPasswordCode } = useRequestForgotPasswordVerificationCode()
    const { mutateAsync: resetForgottenPassword, isPending: loadingPasswordReset } = useResetForgottenPassword()

    const handleToggle = () => {
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    };

    const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
        resolver: zodResolver(ForgotPasswordValidation),
        defaultValues: {
            email: "",
            pin: "",
            newPassword: "",
            newPasswordConfirm: "",
        },
    })

    const handleNewEmailChange = (newEmail: string) => {
        form.clearErrors("email")
        form.setValue('email', newEmail);
        if (newEmail.trim() === '') {
            setShowOTPField(false);
        }
    };

    const requestValidationCode = async () => {
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const email = form.getValues('email');
        if (email.trim() !== '' && email.match(isValidEmail)) {
            setShowOTPField(true);
            setShowPasswordResetCanel(true)
            const res = await requestForgotPasswordCode({ email: email })
        } else {
            form.setError("email", {
                type: "manual",
                message: "Please enter valid email address",
            })
        }
    };

    const cancelPasswordResetProcess = async () => {
        setShowOTPField(false);
        setShowPasswordFiels(false);
        setShowPasswordResetCanel(false);
    };

    const otpComplete = async () => {
        const code = form.getValues("pin")
        if (code) {
            const res: ForgotPasswordResponse = await verifyPasswordResetCode({ code: code })
            console.log(res)
            if (res.status === 400 && res.error.error === 'Token is invalid or has expired') {
                toast.info('Token is invalid or has expired')
                form.setValue('pin', '')
                form.setFocus('pin')
            } else if (res.status === 200 && res.data.success === 'Valid Code') {
                setShowPasswordFiels(true);
                setShowOTPField(false);
                form.setFocus('newPassword')
            }
        }
    };

    async function onSubmit(data: z.infer<typeof ForgotPasswordValidation>) {
        const res: ForgotPasswordResponse = await resetForgottenPassword({
            password: data.newPassword,
            confirmPassword: data.newPasswordConfirm,
            email: data.email,
            code: data.pin
        })
        if (res.status === 200 && res.data.success === 'Password Reset Success') {
            navigate('/sign-in')
            toast.success('Your Password has been successfully updated! Please login with your new credentials')
            setShowPasswordFiels(false);
            setShowOTPField(false);
            form.reset()
        } else {
            toast.info('Something went wrong. Fuck you!!')
        }
    }

    return (
        <Card className="w-full px-6 py-8 md:px-8 lg:w-1/2 rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle>Forgot your Password?</CardTitle>
                <CardDescription>Use the form below to request a one-time code to your email and once you confirm yourelf, you can create a new password!</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 w-full mt-4 max-w-5xl"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">New Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="h-12"
                                            {...field}
                                            onChange={(e) => handleNewEmailChange(e.target.value)}
                                            disabled={(showPasswordFields && !showOTPField) || (showOTPField && !showPasswordFields)}
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
                                    <FormItem className="p-1 overflow-hidden">
                                        <FormLabel className="shad-form_label">Email Verification Code</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                autoFocus
                                                onComplete={otpComplete}
                                                maxLength={8}
                                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                                render={({ slots }) => (
                                                    <>
                                                        <InputOTPGroup>
                                                            {slots.slice(0, 4).map((slot, index) => (
                                                                <InputOTPSlot key={index} {...slot} className="h-[47px] w-[47px]" />
                                                            ))}{" "}
                                                        </InputOTPGroup>
                                                        <InputOTPDash />
                                                        <InputOTPGroup>
                                                            {slots.slice(4).map((slot, index) => (
                                                                <InputOTPSlot key={index + 3} {...slot} className="h-[47px] w-[47px]" />
                                                            ))}
                                                        </InputOTPGroup>
                                                    </>
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {(showOTPField) && (
                                            <>
                                                <FormDescription className="py-2">
                                                    We emailed you an eight-digit code to{" "}
                                                    <span className="font-bold text-base">{form.getValues('email')}</span>.
                                                    Enter the code you recieved to confirm your identity and continue resetting your password.
                                                </FormDescription>
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
                                            </>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className={`flex flex-col gap-5 transition-all duration-500 delay-700 overflow-hidden ${showPasswordFields ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="shad-form_label">Password</FormLabel>
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
                                name="newPasswordConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="shad-form_label">Confirm Password</FormLabel>
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
                        </div>

                        {(!showOTPField && !showPasswordFields) && <Button type="button" onClick={requestValidationCode}>
                            Request Validation Code
                        </Button>
                        }

                        {(showPasswordResetCancel) && <Button variant={"secondary"} className="border-2 text-lg" type="button" onClick={cancelPasswordResetProcess}>
                            Cancel
                        </Button>
                        }

                        {(!showOTPField && showPasswordFields) && <Button type="submit" disabled={false} className="mt-3">
                            {loadingPasswordReset ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Uploading...
                                </>
                            ) : (
                                <>Reset Password</>
                            )}
                        </Button>
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
export default ForgotPasswordForm;