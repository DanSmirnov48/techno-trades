import { useState } from 'react';
import { Shell } from "@/components/dashboard/shell";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { SendPasswordResetOtpForm, SetNewPasswordForm } from '../forms';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserEmailSchemaType } from '../schemas';

export default function PasswordReset() {
    const [activeTabs, setActiveTabs] = useState<string[]>(['otp']);
    const [userData, setUserData] = useState<UserEmailSchemaType | undefined>();

    return (
        <Shell variant={'default'} className='max-w-xl p-0'>
            <Card>
                <CardHeader className="flex gap-6 p-5">
                    <CardTitle className="flex flex-row justify-center">
                        <img src="/logo.ico" alt="" className="w-10 mr-2" />
                        <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
                    </CardTitle>
                    <h1 className="text-2xl text-center font-jost">
                        Password Reset
                    </h1>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={["otp"]} value={activeTabs} onValueChange={setActiveTabs}>
                        <AccordionItem value="otp" className='border-none'>
                            <AccordionContent className='px-1'>
                                <SendPasswordResetOtpForm
                                    activeTabs={activeTabs}
                                    setActiveTabs={setActiveTabs}
                                    setUserData={setUserData}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="password" className='border-none'>
                            <AccordionContent className='px-1'>
                                <SetNewPasswordForm
                                    activeTabs={activeTabs}
                                    userData={userData}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                {activeTabs.includes('password') &&
                    <CardFooter className='flex items-center justify-center mx-9'>
                        <Link
                            to={"/auth/sign-in"}
                            className={cn(
                                buttonVariants({
                                    className: "w-full text-lg font-medium tracking-wide",
                                    size: "lg",
                                    variant: "outline"
                                }),
                            )}
                            onClick={() => {
                                setUserData(undefined)
                                setActiveTabs(["otp"])
                            }}
                        >
                            Cancel
                        </Link>
                    </CardFooter>
                }
            </Card>
        </Shell >
    )
}