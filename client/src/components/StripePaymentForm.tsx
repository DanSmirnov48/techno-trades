import { useCallback, useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Icons } from './shared';
import { useUserContext } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { createPaymentIntent } from '@/lib/backend-api/orders';
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Skeleton } from './ui/skeleton';
import { appearance, stripePaymentElementOptions } from '@/constants/idnex';
import { ShippingOption } from './shippingForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PRIVATE_KEY);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/completion`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} className='w-full max-w-[650px]'>
            <PaymentElement id="payment-element" options={stripePaymentElementOptions} />
            <Button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-dark-4 py-7 dark:text-white/90 text-lg mt-10"
                size="lg"
                onClick={() => (console.log("first"))}
            >
                {isLoading ?
                    <div className="spinner" id="spinner"></div> :
                    <>
                        <Icons.visa className="w-16 bg-light-2 rounded-md p-1.5 mr-2" />
                        Place order
                    </>
                }
            </Button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
}

const FormLoading = () => (
    <Card className="w-full max-w-[650px] shadow-md flex flex-col gap-5 content-center justify-center bg-accent py-16 px-20 cursor-wait">
        <CardContent className='flex flex-col gap-4'>
            <div className='space-y-2'>
                <CardDescription>Card number</CardDescription>
                <Skeleton className=" bg-white h-12 w-full border-2" />
            </div>
            <div className="flex flex-row gap-5">
                <div className='w-full space-y-2'>
                    <CardDescription>Expiration data</CardDescription>
                    <Skeleton className=" bg-white h-12 w-full border-2" />
                </div>
                <div className='w-full space-y-2'>
                    <CardDescription>Security code</CardDescription>
                    <Skeleton className=" bg-white h-12 w-full border-2" />
                </div>
            </div>
        </CardContent>
    </Card>
)

const StripeCheckout = () => {
    const { items } = useCart();
    const { user, isAuthenticated } = useUserContext();
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPaymentIntent = useCallback(async () => {
        if (!isAuthenticated || !user?._id || items.length === 0) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const order = items.map(({ product, quantity }) => ({
                productId: product._id!,
                quantity: quantity,
            }));

            const clientSecret = await createPaymentIntent({
                order: order,
                userId: user._id
            });

            if (clientSecret) {
                setClientSecret(clientSecret);
            } else {
                setError("Failed to create payment intent");
            }
        } catch (error) {
            setError("Error creating payment intent");
            console.error("Error fetching payment intent:", error);
        } finally {
            setLoading(false);
        }
    }, [items, user._id]);

    useEffect(() => {
        fetchPaymentIntent();
    }, [fetchPaymentIntent]);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: appearance,
        loader: 'auto',
    };

    if (items.length === 0) {
        return <div>Your cart is empty</div>;
    }

    if (loading) {
        return <FormLoading />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={options}>
                {isAuthenticated && <CheckoutForm />}
            </Elements>
        )
    );
};

export default StripeCheckout;