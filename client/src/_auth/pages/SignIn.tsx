import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Icons } from '@/components/shared';
import { UserEmailSchemaType } from '../schemas';
import { Shell } from "@/components/dashboard/shell";
import { buttonVariants } from '@/components/ui/button';
import { GoogleLoginButton, SendLogInOtp, SigninForm, SignInWithOtp } from '../components'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SignIn() {
    const [showTrigger, setShowTrigger] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('password');
    const [showOTPField, setShowOTPField] = useState(false);
    const [userData, setUserData] = useState<UserEmailSchemaType | undefined>();

    const handleTabChange = (value: string) => {
        setShowTrigger(!showTrigger)
        setActiveTab(value)
    };

    return (
        <Shell variant={'default'} className='max-w-xl p-0'>
            <Card>
                <CardHeader className="flex gap-6 p-5">
                    <CardTitle className="flex flex-row justify-center">
                        <img src="/logo.ico" alt="" className="w-10 mr-2" />
                        <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
                    </CardTitle>
                    <h1 className="text-2xl text-center font-jost">
                        Welcome back!
                    </h1>
                </CardHeader>
                <CardContent>
                    <Accordion className='flex flex-col gap-3' type="single" defaultValue={"password"} value={activeTab} onValueChange={handleTabChange}>
                        <AccordionItem value="password" className='border-none'>
                            {showTrigger &&
                                <div className='flex flex-row items-center justify-between gap-4 mx-8 max-w-lg'>
                                    <div className="flex-1">
                                        <AccordionTrigger
                                            showIcon={false}
                                            className={cn(
                                                buttonVariants({
                                                    className: "w-full h-10 border border-gray-900/20 hover:no-underline m-0 p-4 pl-8 relative",
                                                    size: "lg",
                                                    variant: "outline"
                                                }),
                                            )}
                                        >
                                            <Icons.mail className="absolute top-2.5 left-3 w-5 h-5 mr-2" />
                                            Sign in with Password
                                        </AccordionTrigger>
                                    </div>

                                    <div className="flex-1">
                                        <GoogleLoginButton text='signin_with' context='signin' />
                                    </div>
                                </div>
                            }
                            <AccordionContent className='px-1'>
                                <SigninForm returnAs={"form"} />
                            </AccordionContent>
                        </AccordionItem>
                        <Fragment>
                            <div className="mx-8 flex items-center justify-between my-3">
                                <span className="w-[45%] border-b dark:border-gray-600"></span>
                                <div className="text-sm text-center text-gray-500 dark:text-gray-400">or</div>
                                <span className="w-[45%] border-b dark:border-gray-400"></span>
                            </div>
                        </Fragment>
                        <AccordionItem value="otp" className='border-none'>
                            {!showTrigger &&
                                <div className='flex flex-row items-center justify-between gap-4 mx-8 max-w-lg'>
                                    <div className="flex-1">
                                        <AccordionTrigger
                                            showIcon={false}
                                            className={cn(
                                                buttonVariants({
                                                    className: "w-full h-10 border border-gray-900/20 hover:no-underline m-0 p-4 pl-8 relative",
                                                    size: "lg",
                                                    variant: "outline"
                                                }),
                                            )}
                                        >
                                            <Icons.mail className="absolute top-2.5 left-3 w-5 h-5 mr-2" />
                                            Sign in with Email
                                        </AccordionTrigger>
                                    </div>

                                    <div className="flex-1">
                                        <GoogleLoginButton text='signin_with' context='signin' />
                                    </div>
                                </div>
                            }
                            <AccordionContent className='px-1'>
                                <SendLogInOtp
                                    showOTPField={showOTPField}
                                    setShowOTPField={setShowOTPField}
                                    setUserData={setUserData}
                                />
                                {showOTPField &&
                                    <SignInWithOtp
                                        showOTPField={showOTPField}
                                        setShowOTPField={setShowOTPField}
                                        userData={userData}
                                    />
                                }
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                <CardFooter className='flex items-center justify-center my-5'>
                    <div className="flex flex-row  items-center gap-2 text-center">
                        <span className="text-black/50">Don't have an account? </span>
                        <Link
                            to={"/auth/sign-up"}
                            className="text-foreground font-semibold dark:text-gray-400 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </Shell>
    )
}