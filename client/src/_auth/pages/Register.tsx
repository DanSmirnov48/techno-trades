import { useState } from 'react';
import { Shell } from "@/components/dashboard/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { RegisterForm } from '../forms';

export default function PasswordReset() {
    const [activeTabs, setActiveTabs] = useState<string[]>(['register']);

    return (
        <Shell variant={'default'} className='max-w-xl p-0'>
            <Card>
                <CardHeader className="flex gap-6 p-5">
                    <CardTitle className="flex flex-row justify-center">
                        <img src="/logo.ico" alt="" className="w-10 mr-2" />
                        <span className="mt-1 text-2xl text-gray-600 dark:text-gray-200">TechnoTrades</span>
                    </CardTitle>
                    <h1 className="text-2xl text-center font-jost">
                        Create a new account!
                    </h1>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={["register"]} value={activeTabs} onValueChange={setActiveTabs}>
                        <AccordionItem value="register" className='border-none'>
                            <AccordionContent className='px-1'>
                                <RegisterForm />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </Shell >
    )
}