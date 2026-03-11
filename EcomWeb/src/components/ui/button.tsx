import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark disabled:opacity-60 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                primary: "bg-brand-orange text-brand-brown hover:bg-brand-orange/90",
                outline:
                    "border border-slate-700 text-slate-100 hover:border-brand-orange",
                ghost: "text-slate-100 hover:bg-slate-900/70",
                success: "bg-success text-[#052e16] hover:bg-success/90",
                danger: "bg-danger text-[#7f1d1d] hover:bg-danger/90",
            },
            size: {
                sm: "h-8 px-3",
                md: "h-9 px-4",
                lg: "h-10 px-5",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export function Button({
    className,
    variant,
    size,
    asChild,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            className={clsx(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
}
