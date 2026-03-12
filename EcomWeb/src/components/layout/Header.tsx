import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
// import clsx from "clsx";
import logo from "../../assets/nonbg-logo.png";
import defaultAvatar from "../../assets/default-avatar.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutThunk } from "../../features/auth/thunks";
import type { Category, Brand } from "../../api/client";

// ── Mock data (sẽ thay bằng API thật sau) ──────────────────────────
export const mockCategories: Category[] = [
    { id: 1, name: "Điện thoại", description: "Smartphone các loại" },
    { id: 2, name: "Laptop", description: "Laptop văn phòng & gaming" },
    { id: 3, name: "Đồng hồ", description: "Đồng hồ thông minh & cổ điển" },
    { id: 4, name: "Tai nghe", description: "Tai nghe Bluetooth & có dây" },
    { id: 5, name: "Phụ kiện", description: "Ốp lưng, sạc, cáp, ..." },
];

export const mockBrands: Brand[] = [
    { id: 1, name: "Samsung" },
    { id: 2, name: "Apple" },
    { id: 3, name: "Huawei" },
    { id: 4, name: "Oppo" },
    { id: 5, name: "Xiaomi" },
];

interface HeaderProps {
    onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const categoryRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setCategoryDropdownOpen(false);
            }
            if (userRef.current && !userRef.current.contains(e.target as Node)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogout = async () => {
        setUserDropdownOpen(false);
        await dispatch(logoutThunk());
        navigate("/login", { replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    const displayName = user?.fullName || user?.email || "Tài khoản";
    const avatarSrc = user?.avatarUrl || defaultAvatar;
    const cartCount = 3; // mock

    return (
        <header className="sticky top-0 z-40 shadow-sm bg-brand-orange/20">
            {/* ── Main bar ──────────────────────────────────────────── */}
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 lg:h-16">
                {/* Mobile: hamburger (toggles sidebar) */}
                <button
                    className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    onClick={() => {
                        onToggleSidebar?.();
                        setMobileMenuOpen(false);
                    }}
                    aria-label="Mở danh mục"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-2">
                    <img src={logo} alt="E-Shop" className="h-8 w-auto" />
                    <span className="hidden text-lg font-bold tracking-tight sm:inline">
                        <span className="text-brand-orange">E-</span>
                        <span className="text-brand-brown">Shop</span>
                    </span>
                </Link>

                {/* ── Center: Category dropdown + Search (desktop) ─── */}
                <div className="hidden flex-1 items-center gap-2 lg:flex">
                    {/* Category dropdown */}
                    <div ref={categoryRef} className="relative">
                        {/* <button
                            onClick={() => setCategoryDropdownOpen((v) => !v)}
                            className={clsx(
                                "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors bg-white hover:bg-brand-orange/90",
                                categoryDropdownOpen
                                    ? "border-brand-orange text-brand-brown"
                                    : "border-slate-300 text-slate-700 hover:border-brand-orange"
                            )}
                        >
                            Danh mục
                            <ChevronDown
                                className={clsx(
                                    "h-4 w-4 transition-transform",
                                    categoryDropdownOpen && "rotate-180"
                                )}
                            />
                        </button> */}

                        {categoryDropdownOpen && (
                            <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                                <div className="mb-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Danh mục sản phẩm
                                    </p>
                                    <div className="space-y-0.5">
                                        {mockCategories.map((c) => (
                                            <Link
                                                key={c.id}
                                                to={`/products?category=${c.id}`}
                                                onClick={() => setCategoryDropdownOpen(false)}
                                                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-brand-orange/10 hover:text-brand-brown transition-colors"
                                            >
                                                {c.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <hr className="my-2 border-slate-100" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Thương hiệu
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mockBrands.map((b) => (
                                            <Link
                                                key={b.id}
                                                to={`/products?brand=${b.id}`}
                                                onClick={() => setCategoryDropdownOpen(false)}
                                                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-orange hover:text-brand-brown transition-colors"
                                            >
                                                {b.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-lg mx-auto">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition-colors"
                        />
                    </form>
                </div>

                {/* ── Right: Cart + Auth ──────────────────────────── */}
                <div className="ml-auto flex items-center gap-2">
                    {/* Mobile search toggle */}
                    <button
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        aria-label="Tìm kiếm"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-brand-brown">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth area */}
                    {!isAuthenticated || !user ? (
                        <div className="hidden items-center gap-1.5 sm:flex">
                            <Link
                                to="/login"
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-orange hover:text-brand-brown transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-brand-brown hover:bg-brand-orange/90 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    ) : (
                        <div ref={userRef} className="relative">
                            <button
                                onClick={() => setUserDropdownOpen((v) => !v)}
                                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
                            >
                                <img
                                    src={avatarSrc}
                                    alt={displayName}
                                    className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                                />
                                <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 md:inline">
                                    {displayName}
                                </span>
                                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                                    <div className="px-3 py-2 border-b border-slate-100">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <User className="h-4 w-4" />
                                        Trang cá nhân
                                    </Link>
                                    <Link
                                        to="/cart"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Giỏ hàng
                                    </Link>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Mobile: search bar (expands below header) ─────── */}
            {mobileMenuOpen && (
                <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            autoFocus
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition-colors"
                        />
                    </form>

                    {/* Mobile: login/register if not authenticated */}
                    {(!isAuthenticated || !user) && (
                        <div className="mt-3 flex gap-2 sm:hidden">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 rounded-lg border border-slate-300 py-2 text-center text-xs font-medium text-slate-700 hover:border-brand-orange"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 rounded-lg bg-brand-orange py-2 text-center text-xs font-semibold text-brand-brown"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
