import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";
import clsx from "clsx";

const adminItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Sản phẩm", icon: Package },
    { to: "/admin/users", label: "Người dùng", icon: Users },
    { to: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="hidden w-60 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 px-3 py-4 md:block">
            <div className="space-y-1 text-sm">
                {adminItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={clsx(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-900",
                                active ? "bg-slate-900 text-emerald-400" : "text-slate-200"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
