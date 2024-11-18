import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLogingWithOtp } from "@/lib/react-query/queries/user-queries";
import {
    Form,
    FormControl,
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUser } from "@/types";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthResponse {
    data?: any;
    error?: any;
    status?: any;
}

const OtpSchema = z.object({
    otp: z.string()
})

export default function SignInWithOtp() {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useLogingWithOtp()
    const { setUser, setIsAuthenticated, setIsAdmin } = useUserContext();

    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            otp: "",
        },
    });

    async function onSubmit(data: z.infer<typeof OtpSchema>) {
        const session: AuthResponse = await mutateAsync({ otp: data.otp });

        if (session.data && session.data.status === "success") {
            const user = session.data.data.user as IUser;
            setUser(user);
            setIsAuthenticated(true);
            user.role === 'admin' && setIsAdmin(true);
            toast.success(`Nice to see you back ${user.firstName}`);
            navigate("/");
        }
    }

    return (
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
            </form>
        </Form>
    );
}