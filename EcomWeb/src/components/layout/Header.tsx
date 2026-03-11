import { Menu, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/nontext-logo.png";

export function Header() {
    const [openMobile, setOpenMobile] = useState(false);

    return (
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="E-Shop" className="h-8 w-auto" />
                        <span className="text-lg font-semibold tracking-tight">
                            <span className="text-brand-orange">E-</span>
                            <span className="text-brand-brown">Shop</span>
                        </span>
                    </Link>
                </div>

                {/* Nav desktop */}
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link to="/products" className="text-slate-700 hover:text-brand-brown">
                        Sản phẩm
                    </Link>
                    <Link to="/brands" className="text-slate-700 hover:text-brand-brown">
                        Thương hiệu
                    </Link>
                    <Link to="/deals" className="text-slate-700 hover:text-brand-brown">
                        Khuyến mãi
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/cart"
                        className="relative inline-flex items-center justify-center rounded-full border border-slate-300 p-2 hover:border-brand-orange"
                    >
                        <ShoppingCart className="h-4 w-4 text-slate-700" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-brand-brown">
                            0
                        </span>
                    </Link>
                    <Link
                        to="/login"
                        className="hidden items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange md:inline-flex"
                    >
                        <User className="h-4 w-4" />
                        Đăng nhập
                    </Link>

                    <button
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 hover:border-brand-orange md:hidden"
                        onClick={() => setOpenMobile((v) => !v)}
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {openMobile && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 text-sm md:hidden">
                    <div className="flex flex-col gap-2">
                        <Link to="/products" className="text-slate-700 hover:text-brand-brown">
                            Sản phẩm
                        </Link>
                        <Link to="/brands" className="text-slate-700 hover:text-brand-brown">
                            Thương hiệu
                        </Link>
                        <Link to="/deals" className="text-slate-700 hover:text-brand-brown">
                            Khuyến mãi
                        </Link>
                        <Link
                            to="/login"
                            className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange"
                        >
                            <User className="mr-1 h-4 w-4" />
                            Đăng nhập
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}

