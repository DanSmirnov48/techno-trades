import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserEmailSchemaType } from '../schemas';
import { Shell } from "@/components/dashboard/shell";
import { SendPasswordResetOtpForm, SetNewPasswordForm } from '../components';
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PasswordReset() {
    const [activeTab, setActiveTab] = useState<string>('otp');
    const [userData, setUserData] = useState<UserEmailSchemaType | undefined>();
    const [hasError, setHasError] = useState(false);

    const triggerShakeAnimation = () => {
        setHasError(true);
        setTimeout(() => {
            setHasError(false);
        }, 500);
    };

    return (
        <Shell variant={'default'} className='max-w-xl p-0 gap-4'>
            <Link to={"/"}>
                <CardTitle className="flex flex-row justify-center">
                    <img src="/logo.ico" alt="" className="w-10 mr-2" />
                    <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
                </CardTitle>
            </Link>
            <Card className={`${hasError ? 'animate-shake' : ''} transition-all duration-500`}>
                <CardHeader className="flex gap-3 px-[60px] mt-5">
                    <CardTitle className="text-2xl text-center font-jost font-medium m-0 p-0">
                        Reset your password
                    </CardTitle>
                    {activeTab === 'opt' && <CardDescription className="m-0 p-0">
                        Enter the email address associated with your account and we'll send you a code to reset your password.
                    </CardDescription>}
                </CardHeader>
                <CardContent className='pb-0'>
                    <Accordion type="single" defaultValue={"otp"} value={activeTab} onValueChange={setActiveTab}>
                        <AccordionItem value="otp" className='border-none'>
                            <AccordionContent className='px-1'>
                                <SendPasswordResetOtpForm
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    setUserData={setUserData}
                                    triggerErrorAnimation={triggerShakeAnimation}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="password" className='border-none'>
                            <AccordionContent className='px-1'>
                                <SetNewPasswordForm
                                    activeTab={activeTab}
                                    userData={userData}
                                    triggerErrorAnimation={triggerShakeAnimation}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <CardFooter className='flex items-center justify-center'>
                        <Link
                            to={"/auth/sign-in"}
                            className='text-sm font-normal'
                            onClick={() => {
                                setUserData(undefined)
                                setActiveTab("otp")
                            }}
                        >
                            Return to sign in
                        </Link>
                    </CardFooter>
                </CardContent>
                <CardFooter className='flex items-center justify-center bg-primary-foreground dark:bg-dark-4 m-1 p-5 rounded-md'>
                    <div className="flex flex-row  items-center gap-2 text-center">
                        <span className="text-primary">Don't have an account? </span>
                        <Link
                            to={"/auth/sign-up"}
                            className="text-foreground font-semibold hover:underline">
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
            <div className="flex mx-1 items-center">
                <Link
                    to={"/"}
                    className="text-muted-foreground font-medium hover:text-foreground after:content-['•'] after:mx-3 after:text-muted-foreground last:after:content-['']">
                    © TechnoTrades
                </Link>
                <Link
                    to={"/"}
                    className="text-muted-foreground font-medium hover:text-foreground after:content-['•'] after:mx-3 after:text-muted-foreground last:after:content-['']">
                    Contact
                </Link>
                <Link
                    to={"/"}
                    className="text-muted-foreground font-medium hover:text-foreground last:after:content-['']">
                    Privacy & terms
                </Link>
            </div>
        </Shell >
    )
}