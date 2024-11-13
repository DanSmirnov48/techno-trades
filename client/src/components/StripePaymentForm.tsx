import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Icons } from './shared';

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
            <PaymentElement id="payment-element" />
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

const StripeCheckout = () => {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch("/api/stripe-custom/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: 1000,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log({ data })
                setClientSecret(data.clientSecret);
            });
    }, []);

    return (
        clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
            </Elements>
        )
    );
};

export default StripeCheckout;