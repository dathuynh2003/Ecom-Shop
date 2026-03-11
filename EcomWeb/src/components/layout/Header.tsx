// src/components/layout/Header.tsx
import { Menu, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/nontext-logo.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutThunk } from "../../features/auth/thunks";

export function Header() {
    const [openMobile, setOpenMobile] = useState(false);
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutThunk());
        navigate("/login", { replace: true });
    };

    const displayName = user?.fullName || user?.email || "Tài khoản";

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
                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative inline-flex items-center justify-center rounded-full border border-slate-300 p-2 hover:border-brand-orange"
                    >
                        <ShoppingCart className="h-4 w-4 text-slate-700" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-brand-brown">
                            0
                        </span>
                    </Link>

                    {/* Desktop: nếu chưa login thì nút Đăng nhập, nếu login thì menu user + Logout */}
                    {!isAuthenticated || !user ? (
                        <Link
                            to="/login"
                            className="hidden items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange md:inline-flex"
                        >
                            <User className="h-4 w-4" />
                            Đăng nhập
                        </Link>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (user.roleName === "Admin") {
                                        navigate("/admin");
                                    } else {
                                        navigate("/account");
                                    }
                                }}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange"
                            >
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={displayName}
                                        className="h-5 w-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-4 w-4" />
                                )}
                                <span className="max-w-[120px] truncate">
                                    {displayName}
                                </span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-slate-600 hover:text-red-500"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 hover:border-brand-orange md:hidden"
                        onClick={() => setOpenMobile((v) => !v)}
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {openMobile && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 text-sm md:hidden">
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/products"
                            className="text-slate-700 hover:text-brand-brown"
                            onClick={() => setOpenMobile(false)}
                        >
                            Sản phẩm
                        </Link>
                        <Link
                            to="/brands"
                            className="text-slate-700 hover:text-brand-brown"
                            onClick={() => setOpenMobile(false)}
                        >
                            Thương hiệu
                        </Link>
                        <Link
                            to="/deals"
                            className="text-slate-700 hover:text-brand-brown"
                            onClick={() => setOpenMobile(false)}
                        >
                            Khuyến mãi
                        </Link>

                        {/* Mobile: login / user + logout */}
                        {!isAuthenticated || !user ? (
                            <Link
                                to="/login"
                                className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange"
                                onClick={() => setOpenMobile(false)}
                            >
                                <User className="mr-1 h-4 w-4" />
                                Đăng nhập
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setOpenMobile(false);
                                        if (user.roleName === "Admin") {
                                            navigate("/admin");
                                        } else {
                                            navigate("/account");
                                        }
                                    }}
                                    className="mt-2 inline-flex items-center justify-between rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange"
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={displayName}
                                                className="h-4 w-4 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                        <span className="max-w-[140px] truncate">
                                            {displayName}
                                        </span>
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {user.roleName}
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenMobile(false);
                                        handleLogout();
                                    }}
                                    className="mt-1 text-left text-xs text-red-500"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
