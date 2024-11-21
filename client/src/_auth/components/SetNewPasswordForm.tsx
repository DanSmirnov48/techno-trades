import {
    Form,
    FormControl,
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
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fragment, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSetNewPassword } from "@/lib/react-query/queries/user-queries";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { passwordReset, PasswordResetType, UserEmailSchemaType } from "../schemas";

interface ForgotPasswordResponse {
    data?: any;
    error?: any;
    status?: number;
    statusTest?: string;
}

interface SendPasswordResetOtpProps {
    activeTabs: string[]
    userData: UserEmailSchemaType | undefined
}

export default function SetNewPasswordForm({ activeTabs, userData }: SendPasswordResetOtpProps) {
    const navigate = useNavigate();
    const disableField = activeTabs.includes('password')
    const [type, setType] = useState<'password' | 'text'>('password');
    const { mutateAsync: setNewPassword, isPending } = useSetNewPassword()
    const form = useForm<PasswordResetType>({ resolver: zodResolver(passwordReset) })

    const handleToggle = () => {
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    };

    async function onSubmit(data: PasswordResetType) {
        const res: ForgotPasswordResponse = await setNewPassword({
            password: data.newPassword,
            email: userData!.email,
            otp: data.otp
        })
        if (res.status === 200 && res.data.success === 'Password Reset Success') {
            navigate('/auth/sign-in')
            toast.success('Your Password has been successfully updated! Please login with your new credentials')
            form.reset()
        } else {
            toast.info('Something went wrong. Fuck you!!')
        }
    }

    return (
        <Fragment>
            {(disableField) && (
                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <span className="sr-only">Info</span>
                    <div className="text-base">
                        We have emailed a{" "}
                        <span className="italic font-medium">One Time Password</span>{" "}
                        to {userData?.email}
                    </div>
                </div>
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 w-full mt-4 max-w-5xl"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">One Time Password</FormLabel>
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
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Password</FormLabel>
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
                                <FormLabel className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">Confirm Password</FormLabel>
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
                    <Button type="submit" size={"lg"} disabled={isPending} className="w-full text-lg font-medium tracking-wide mt-3">
                        {isPending ?
                            <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> :
                            <>Reset Password</>
                        }
                    </Button>
                </form>
            </Form >
        </Fragment>
    );
}
