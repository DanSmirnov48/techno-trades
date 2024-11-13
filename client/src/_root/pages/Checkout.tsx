import { Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useCreateOrder } from "@/lib/react-query/queries/order-queries";
import StripePaymentForm from '@/components/StripePaymentForm'
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator";

const Cart = () => {
    const delivery = Number(49.99);
    const { items } = useCart();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const cartTotal = items.reduce((total, { product, quantity }) => total + (product.isDiscounted ? product.discountedPrice! : product.price) * quantity, 0);
    const { user } = useUserContext();
    const { mutateAsync: CreateOrder } = useCreateOrder();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function checkOutHandler() {
        const order = items.map(({ product, quantity }) => {
            return {
                productId: product._id!,
                quantity: quantity,
            };
        });
        await CreateOrder({ orders: order, userId: user._id });
    }

    return (
        <div className="flex flex-col flex-1 min-h-screen items-center">
            <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-xl">
                <h1 className="text-xl font-bold tracking-tight text-dark-4 dark:text-white/90 sm:text-3xl text-center mb-5">
                    Checkout
                </h1>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
                    <div className="lg:col-span-3 flex flex-col gap-10">
                        <StripePaymentForm />
                    </div>
                    <section className="border lg:col-span-2 mt-16 rounded-lg bg-zinc-50 dark:bg-dark-4 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8 h-fit relative">
                        <h2 className="text-xl font-normal text-dark-4 dark:text-white/90 mb-5">Order summary</h2>
                        <Separator className="w-full absolute right-0 h-0.5" />
                        <Table>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.product._id} className={cn("hover:bg-transparent select-none border-b-0")}>
                                        <TableCell className="px-0">
                                            <div key={item.product._id} className="flex max-w-md">
                                                <div className="relative h-24 w-24 border p-2 rounded-md bg-white">
                                                    <img
                                                        src={item.product.image[0].url}
                                                        alt="product image"
                                                        className="h-full w-full rounded-md object-contain"
                                                    />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col sm:ml-6 justify-center gap-1">
                                                    <h3 className="text-md text-dark-4 dark:text-white/90 font-semibold">{item.product.name}</h3>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="">
                                            {formatPrice(item.product.price * item.quantity, { currency: "GBP" })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Separator className="w-full absolute right-0 h-0.5" />

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Subtotal</p>
                                <p className="text-sm font-medium text-dark-4 dark:text-white/90">
                                    {isMounted ? (
                                        formatPrice(cartTotal, { currency: "GBP" })
                                    ) : (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-gray-200">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span>Shipping</span>
                                </div>
                                <div className="text-sm font-medium text-dark-4 dark:text-white/90">
                                    {isMounted ? (
                                        formatPrice(cartTotal > 150 ? 0 : delivery, {
                                            currency: "GBP",
                                        })
                                    ) : (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            <Separator className="w-full absolute right-0 h-0.5" />

                            <div className="flex items-center justify-between border-gray-200 pt-10">
                                <div className="text-lg font-medium text-muted-foreground">
                                    Total
                                </div>
                                <div className="text-xl font-medium text-dark-4 dark:text-white/90">
                                    {isMounted ? (
                                        formatPrice(
                                            cartTotal + (cartTotal > 150 ? 0 : delivery),
                                            { currency: "GBP" }
                                        )
                                    ) : (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Cart;