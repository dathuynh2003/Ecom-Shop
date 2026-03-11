import clsx from "clsx";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "brand" | "category" | "neutral";
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
    const base =
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
    const styles =
        {
            neutral: "border-slate-200 bg-slate-50 text-slate-700",
            brand: "border-brand-orange bg-brand-orange/10 text-brand-brown",
            category: "border-brand-brown bg-brand-brown/10 text-brand-brown",
        }[variant] || "";


    return <span className={clsx(base, styles)}>{children}</span>;
}
