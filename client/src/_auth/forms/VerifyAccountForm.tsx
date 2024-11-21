import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPDash,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyAccount } from "@/lib/react-query/queries/user-queries";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Fragment } from "react";
import { RegisterValidationType, OtpSchemaType, otpSchema } from "../schemas";

interface VerifyAccountFormProps {
    userData: RegisterValidationType | undefined
    activeTabs: string[]
    setActiveTabs: React.Dispatch<React.SetStateAction<string[]>>
}

export default function VerifyAccountForm({ userData, activeTabs, setActiveTabs }: VerifyAccountFormProps) {
    const { mutateAsync: verifyAccount, isPending } = useVerifyAccount();
    const form = useForm<OtpSchemaType>({ resolver: zodResolver(otpSchema) })

    async function onSubmit(data: OtpSchemaType) {
        const res = await verifyAccount({ code: data.otp });
        //@ts-ignore
        if (res.status === 400 && res.error.error === "Invalid verification code") {
            toast.error("Invalid verification code");
        } else {
            form.reset();
            setActiveTabs(['confirm'])
            toast.success("Successfully Verified");
        }
    }

    return (
        <Fragment>
            {(activeTabs.includes('otp')) && (
                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <span className="sr-only">Info</span>
                    <div className="text-base">
                        We have sent a{" "}
                        <span className="italic font-medium">One Time Password</span>{" "}
                        to {userData?.email}.
                    </div>
                </div>
            )}
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
                            <>Verify Account</>
                        )}
                    </Button>
                </form>
            </Form>
        </Fragment>
    );
};
