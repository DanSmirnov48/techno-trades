import { Shell } from '@/components/dashboard/shell'
import { cn } from '@/lib/utils'
import { OTPInput, SlotProps } from 'input-otp'
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useVerifyAccount } from '@/lib/react-query/queries'

const OtpForm = () => {

    const [otp, setOtp] = useState<string | null>(null)
    const { mutateAsync: verifyAccount, isPending } = useVerifyAccount()

    const onSubmit = async () => {
        if (otp) {
            const res = await verifyAccount({ code: otp })
            console.log(res)
            setOtp(null)
        }
    }

    return (
        <Shell className='flex items-center justify-center'>
            <Card className='flex flex-col items-center justify-center overflow-hidden p-10 gap-3'>
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>We have sent a code to your email ba**@mail.com</CardDescription>
                </CardHeader>
                <CardContent>
                    <OTPInput
                        value={otp ?? ''}
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
                </CardContent>
                <CardFooter className='flex flex-col space-y-5'>
                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                        <p>Didn't recieve code?</p> <a className="flex flex-row items-center text-blue-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
                    </div>
                </CardFooter>
            </Card>
        </Shell>
    )
}

export default OtpForm

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                'relative w-14 h-16 text-[2rem]',
                'flex items-center justify-center',
                'transition-all duration-300',
                'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
                'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
                'outline outline-0 outline-accent-foreground/20',
                { 'outline-4 outline-accent-foreground': props.isActive },
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    )
}

function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-dark-4 dark:bg-white" />
        </div>
    )
}

function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    )
}
