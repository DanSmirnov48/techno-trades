import { cn } from '@/lib/utils';
import { Fragment, useState } from 'react';
import { Icons } from '@/components/shared';
import { Shell } from "@/components/dashboard/shell";
import { buttonVariants } from '@/components/ui/button';
import { SendLogInOtp, SigninForm, SignInWithOtp } from '../forms'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SignIn() {
    const [showTrigger, setShowTrigger] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('otp');

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
                    <Accordion type="single" defaultValue={"password"} value={activeTab} onValueChange={handleTabChange}>
                        <AccordionItem value="password" className='border-none'>
                            {showTrigger &&
                                <AccordionTrigger className={cn(
                                    buttonVariants({
                                        className: "w-full border-2 text-lg font-medium tracking-wide mb-5 hover:no-underline",
                                        size: "lg",
                                        variant: "outline"
                                    }),
                                )}>
                                    <Icons.mail className="w-5 h-5 mr-2" />
                                    Sign in with Email & Password
                                </AccordionTrigger>
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
                                <AccordionTrigger className={cn(
                                    buttonVariants({
                                        className: "w-full border-2 text-lg font-medium tracking-wide hover:no-underline",
                                        size: "lg",
                                        variant: "outline"
                                    }),
                                )}>
                                    <Icons.mail className="w-5 h-5 mr-2" />
                                    Sign in with Email
                                </AccordionTrigger>
                            }
                            <AccordionContent className='px-1'>
                                <SendLogInOtp />
                                <SignInWithOtp />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </Shell>
    )
}