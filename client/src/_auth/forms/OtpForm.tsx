import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OTPInput, SlotProps } from "input-otp";
import { Shell } from "@/components/dashboard/shell";
import { useVerifyAccount } from "@/lib/react-query/queries";
import { useUserStore } from "@/hooks/store";
import { Button } from "@/components/ui/button";

const OtpForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string | null>(null);
    const { mutateAsync: verifyAccount, isPending } = useVerifyAccount();
    const user = useUserStore((state) => state.user);

    const onSubmit = async () => {
        if (otp) {
            const res = await verifyAccount({ code: otp });
            //@ts-ignore
            if (res.status === 400 && res.error.error === "Invalid verification code") {
                setOtp(null);
                toast.error("Invalid verification code");
            } else {
                toast.success("Successfully Verified");
                navigate("/account-verified");
            }
        }
    };

    return (
        <Shell className="flex items-center justify-center">
            <Card className="flex flex-col items-center justify-center overflow-hidden p-10 gap-3 max-w-xl">
                <CardHeader>
                    <CardTitle>Verify your email address</CardTitle>
                    {user && (
                        <CardDescription className="py-2">
                            We emailed you a six-digit code to{" "}
                            <span className="font-bold text-base">{user.email}</span>. 
                            Enter the code below to confirm your email address.
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {isPending ? (
                        <Loader2 className="animate-spin w-20 h-20" />
                    ) : (
                        <OTPInput
                            value={otp ?? ""}
                            onChange={setOtp}
                            onComplete={onSubmit}
                            maxLength={6}
                            containerClassName="group flex items-center justify-center has-[:disabled]:opacity-30"
                            render={({ slots }) => (
                                <>
                                    <div className="flex">
                                        {slots.slice(0, 3).map((slot, idx) => (
                                            <Slot key={idx} {...slot} />
                                        ))}
                                    </div>

                                    <FakeDash />

                                    <div className="flex">
                                        {slots.slice(3).map((slot, idx) => (
                                            <Slot key={idx} {...slot} />
                                        ))}
                                    </div>
                                </>
                            )}
                        />
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-5 w-full">
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
                </CardFooter>
            </Card>
        </Shell>
    );
};

export default OtpForm;

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                "relative w-14 h-16 text-[2rem]",
                "flex items-center justify-center",
                "transition-all duration-300",
                "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
                "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
                "outline outline-0 outline-accent-foreground/20",
                { "outline-4 outline-accent-foreground": props.isActive }
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    );
}

function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-dark-4 dark:bg-white" />
        </div>
    );
}

function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    );
}
