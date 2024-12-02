import React from "react"
import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import { ArrowRight, Loader2, LockKeyholeIcon } from "lucide-react"

const buttonVariants = cva(
    "group relative inline-flex h-12 items-center justify-center whitespace-nowrap overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 duration-500 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isPending: boolean
    text: string
}

export const AuthButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isPending, text, is, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                <div className="relative inline-flex -translate-x-0 items-center transition group-hover:translate-x-6">
                    <div className="absolute -translate-x-4 opacity-0 transition group-hover:-translate-x-6 group-hover:opacity-100">
                        <LockKeyholeIcon className="h-5 w-5" />
                    </div>
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-3" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <span className="pr-6">{text}</span>
                            <div className="absolute right-0 translate-x-0 opacity-100 transition group-hover:translate-x-4 group-hover:opacity-0">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </>
                    )}
                </div>
            </button>
        )
    }
)

AuthButton.displayName = "AuthButton"