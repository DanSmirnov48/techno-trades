import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterValidationType } from '../schemas';
import { Shell } from "@/components/dashboard/shell";
import { useResendVerificationEmail } from '../lib/queries';
import { Button, buttonVariants } from '@/components/ui/button';
import { VerifyAccountForm, RegisterForm, GoogleLoginButton } from '../components';
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PasswordReset() {
    const [activeTabs, setActiveTabs] = useState<string[]>(['register']);
    const [userData, setUserData] = useState<RegisterValidationType | undefined>();

    const { mutateAsync } = useResendVerificationEmail()

    async function requestNewCode() {
        const resposne = await mutateAsync({ email: userData!.email })
        if (resposne.status === 'success') {
            toast.info(resposne.message)
        }
    }

    return (
        <Shell variant={'default'} className='max-w-xl p-0'>
            <Card>
                <CardHeader className="flex gap-6 p-5">
                    <CardTitle className="flex flex-row justify-center">
                        <img src="/logo.ico" alt="" className="w-10 mr-2" />
                        <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
                    </CardTitle>
                    <h1 className="text-2xl text-center font-jost">
                        {activeTabs.includes('register') && <>Create a new account!</>}
                        {activeTabs.includes('otp') && <>Verify your account!</>}
                        {activeTabs.includes('confirm') && <>Success</>}
                    </h1>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={["register", "otp", "confirm"]} value={activeTabs} onValueChange={setActiveTabs}>
                        <AccordionItem value="register" className='border-none'>
                            <AccordionContent className='px-1'>
                                <GoogleLoginButton text='signup_with' context='signup'/>
                                <Fragment>
                                    <div className="flex items-center justify-between my-5">
                                        <span className="w-[45%] border-b dark:border-gray-600"></span>
                                        <div className="text-sm text-center text-gray-500 dark:text-gray-400">or</div>
                                        <span className="w-[45%] border-b dark:border-gray-400"></span>
                                    </div>
                                </Fragment>
                                <RegisterForm
                                    setActiveTabs={setActiveTabs}
                                    setUserData={setUserData}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="otp" className='border-none'>
                            <AccordionContent className='px-1'>
                                <VerifyAccountForm
                                    userData={userData}
                                    activeTabs={activeTabs}
                                    setActiveTabs={setActiveTabs}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="confirm" className='border-none'>
                            <AccordionContent className='px-1'>
                                <Card className="flex flex-col items-center justify-center overflow-hidden p-10 gap-3 max-w-xl">
                                    <CardHeader>
                                        <CardTitle>
                                            Thank you {userData?.firstName} {userData?.lastName}!
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-row gap-3 items-center justify-center">
                                        <img src="/images/verified.png" className="w-20 h-20 object-cover" />
                                        <p className="text-2xl">
                                            You have successfully verified your account.
                                        </p>
                                    </CardContent>
                                    <CardFooter className="w-full">
                                        <Link
                                            to="/auth/sign-in"
                                            className={cn(
                                                buttonVariants({
                                                    size: "lg",
                                                    className: "w-full",
                                                })
                                            )}
                                        >
                                            Sign In to your Account
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                {activeTabs.includes('register') &&
                    <CardFooter className='flex items-center justify-center my-5'>
                        <div className="flex flex-row  items-center gap-2 text-center">
                            <span className="text-black/50">Have an account already?</span>
                            <Link
                                to={"/auth/sign-in"}
                                className="text-foreground font-semibold dark:text-gray-400 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardFooter>
                }
                {activeTabs.includes('otp') &&
                    <CardFooter className="flex flex-col space-y-5 w-full mt-5">
                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            <p>Didn't recieve code?</p>
                            <HoverCard openDelay={0}>
                                <HoverCardTrigger className="flex flex-row items-center text-blue-600 p-0 cursor-pointer">Resend</HoverCardTrigger>
                                <HoverCardContent className="flex flex-col gap-5 w-[300px]">
                                    <h1>If you did not recieve your code, please check your <span className="font-bold italic">Spam Folder</span> before requesting a new one!</h1>
                                    <Button onClick={() => requestNewCode()}>Request new Code</Button>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </CardFooter>
                }
            </Card>
        </Shell >
    )
}