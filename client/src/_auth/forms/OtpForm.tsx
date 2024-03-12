import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPDash,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { z } from "zod"
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form"
import { useUserStore } from "@/hooks/store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OtpValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useVerifyAccount } from "@/lib/react-query/queries";

const OtpForm = () => {
    const navigate = useNavigate();
    const { mutateAsync: verifyAccount, isPending } = useVerifyAccount();
    const user = useUserStore((state) => state.user);

    const form = useForm<z.infer<typeof OtpValidation>>({
        resolver: zodResolver(OtpValidation),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data: z.infer<typeof OtpValidation>) {
        const res = await verifyAccount({ code: data.pin });
        //@ts-ignore
        if (res.status === 400 && res.error.error === "Invalid verification code") {
            form.reset()
            toast.error("Invalid verification code");
        } else {
            toast.success("Successfully Verified");
            navigate("/account-verified");
            form.reset()
        }
    }

    return (
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 rounded-xl shadow-lg">
            <p className="mt-3 text-2xl text-center text-gray-600 dark:text-gray-200">
                Verify your email address
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        containerClassName="group flex items-center justify-center has-[:disabled]:opacity-30 my-5"
                                        render={({ slots }) => (
                                            <>
                                                <InputOTPGroup>
                                                    {slots.slice(0, 3).map((slot, index) => (
                                                        <InputOTPSlot key={index} {...slot} />
                                                    ))}{" "}
                                                </InputOTPGroup>
                                                <InputOTPDash />
                                                <InputOTPGroup>
                                                    {slots.slice(3).map((slot, index) => (
                                                        <InputOTPSlot key={index + 3} {...slot} />
                                                    ))}
                                                </InputOTPGroup>
                                            </>
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                {user && (
                                    <FormDescription className="py-2">
                                        We emailed you a six-digit code to{" "}
                                        <span className="font-bold text-base">{user.email}</span>.
                                        Enter the code below to confirm your email address.
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button size={"lg"} type="submit" disabled={!user || isPending} className="w-full px-6 py-3 text-lg font-medium tracking-wide text-white dark:text-dark-4 capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                        {isPending ? <><Loader2 className="animate-spin h-5 w-5 mr-3" />Processing...</> : <>Validate Account</>}
                    </Button>
                </form>
            </Form>

            <div className="flex flex-col space-y-5 w-full mt-5">
                <div className="w-full p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300" role="alert">
                    Make sure to keep this window open while check your inbox.
                </div>
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
        </div>
    );
}
export default OtpForm;