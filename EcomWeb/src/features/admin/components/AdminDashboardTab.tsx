interface AdminDashboardTabProps {
    stats: {
        brands: number;
        categories: number;
        specKeys: number;
        products: number;
    };
}

export function AdminDashboardTab({ stats }: AdminDashboardTabProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Brands</p>
                <p className="mt-1 text-2xl font-bold text-brand-brown">{stats.brands}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Categories</p>
                <p className="mt-1 text-2xl font-bold text-brand-brown">{stats.categories}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Spec Keys</p>
                <p className="mt-1 text-2xl font-bold text-brand-brown">{stats.specKeys}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Products</p>
                <p className="mt-1 text-2xl font-bold text-brand-brown">{stats.products}</p>
            </div>
        </section>
    );
}
