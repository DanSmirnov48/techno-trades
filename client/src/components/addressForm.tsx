import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Checkbox } from "./ui/checkbox"
import { Fragment } from "react"

export default function AddressForm() {
    return (
        <Fragment>
            <Card className="w-full max-w-[650px] shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <Address />
                </CardContent>
            </Card>
        </Fragment>
    )
}

const shippingAddressFormSchema = z.object({
    firstName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
    lastName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
    address: z.string().min(1, 'Address is required'),
    appartment: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postcode: z.string().min(5, 'Postcode must be at least 5 characters'),
    country: z.literal('United Kingdom'),
    same_as_billing: z.boolean().default(true).optional(),
})

type ShippingAddressFormSchema = z.infer<typeof shippingAddressFormSchema>

function Address() {
    const form = useForm<ShippingAddressFormSchema>({
        resolver: zodResolver(shippingAddressFormSchema),
        defaultValues: {
            same_as_billing: true
        }
    })

    function onSubmit(data: ShippingAddressFormSchema) {
        toast.info("Address Submited")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-4">

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="First Name" className="block w-full px-4 py-2 h-12"   {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Last Name" className="block w-full px-4 py-2 h-12"{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" className="h-12" placeholder="Address"{...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="appartment"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" className="h-12" placeholder="Appartment/Suite (Optional)"{...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" className="h-12" placeholder="City"{...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-4">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" className="h-12" placeholder="State"{...field} />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" className="h-12" placeholder="Postal Code"{...field} />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="same_as_billing"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2 pl-1">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">
                                    My billing address is the same as my shipping address.
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="submit" disabled={false}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}