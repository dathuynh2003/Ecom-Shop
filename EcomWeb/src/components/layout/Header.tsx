import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
    KeyRound,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/nonbg-logo2.png";
import defaultAvatar from "../../assets/default-avatar.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutThunk } from "../../features/auth/thunks";
import { AuthenticationsService } from "../../api/client/services/AuthenticationsService";
import type { Category, Brand } from "../../api/client";

// ── Mock data (sẽ thay bằng API thật sau) ──────────────────────────
export type MockCategory = Category & { slug: string };
export type MockBrand = Brand & { slug: string };

export const mockCategories: MockCategory[] = [
    { id: 1, name: "Điện thoại", description: "Smartphone các loại", slug: "dien-thoai" },
    { id: 2, name: "Laptop", description: "Laptop văn phòng & gaming", slug: "laptop" },
    { id: 3, name: "Đồng hồ", description: "Đồng hồ thông minh & cổ điển", slug: "dong-ho" },
    { id: 4, name: "Tai nghe", description: "Tai nghe Bluetooth & có dây", slug: "tai-nghe" },
    { id: 5, name: "Phụ kiện", description: "Ốp lưng, sạc, cáp, ...", slug: "phu-kien" },
];

export const mockBrands: MockBrand[] = [
    { id: 1, name: "Samsung", slug: "samsung" },
    { id: 2, name: "Apple", slug: "apple" },
    { id: 3, name: "Huawei", slug: "huawei" },
    { id: 4, name: "Oppo", slug: "oppo" },
    { id: 5, name: "Xiaomi", slug: "xiaomi" },
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

    // Change password popup
    const [showChangePassConfirm, setShowChangePassConfirm] = useState(false);
    const [changePassState, setChangePassState] = useState<"idle" | "loading" | "sent">("idle");

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

    const handleOpenChangePassConfirm = () => {
        setUserDropdownOpen(false);
        setChangePassState("idle");
        setShowChangePassConfirm(true);
    };

    const handleChangePassword = async () => {
        if (!user?.email || changePassState !== "idle") return;
        setChangePassState("loading");
        try {
            await AuthenticationsService.postApiV1AuthenticationsRequestPasswordReset(user.email);
            setChangePassState("sent");
            setTimeout(() => {
                setShowChangePassConfirm(false);
                setChangePassState("idle");
            }, 2000);
        } catch {
            setShowChangePassConfirm(false);
            setChangePassState("idle");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
        }
    };

    const displayName = user?.fullName || user?.email || "Tài khoản";
    const avatarSrc = user?.avatarUrl || defaultAvatar;
    const cartCount = 3; // mock

    return (
        <>
            <header className="sticky top-0 z-40 shadow-md bg-bg-warm/90 backdrop-blur">
                {/* ── Main bar ──────────────────────────────────────────── */}
                <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 lg:h-16">

                    {/* Mobile: hamburger */}
                    <button
                        className="inline-flex items-center justify-center rounded-lg p-2 text-brand-brown hover:bg-brand-orange/10 transition-colors lg:hidden"
                        onClick={() => {
                            onToggleSidebar?.();
                            setMobileMenuOpen(false);
                        }}
                        aria-label="Mở danh mục"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex shrink-0 items-center gap-1.5">
                        <img src={logo} alt="E-Shop" className="h-8 w-auto" />
                        <span className="hidden text-lg font-bold tracking-tight sm:inline">
                            <span className="text-brand-orange">E-</span>
                            <span className="text-brand-brown">Shop</span>
                        </span>
                    </Link>

                    {/* ── Center: Search (desktop) ─────────────────────── */}
                    <div className="hidden flex-1 items-center gap-2 lg:flex">
                        <div ref={categoryRef} className="relative">
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
                                                    to={`/${c.slug}`}
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
                                                <span
                                                    key={b.id}
                                                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-orange hover:text-brand-brown transition-colors cursor-default"
                                                >
                                                    {b.name}
                                                </span>
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
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-colors"
                            />
                        </form>
                    </div>

                    {/* ── Right: Cart + Auth ──────────────────────────── */}
                    <div className="ml-auto flex items-center gap-1">

                        {/* Mobile search toggle */}
                        <button
                            className="inline-flex items-center justify-center rounded-lg p-2 text-brand-brown hover:bg-brand-orange/10 transition-colors lg:hidden"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label="Tìm kiếm"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </button>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative inline-flex items-center justify-center rounded-lg p-2 text-brand-brown hover:bg-brand-orange/10 transition-colors"
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
                            <div className="hidden items-center gap-1.5 sm:flex ml-1">
                                <Link
                                    to="/login"
                                    className="rounded-lg border border-brand-brown/30 px-3 py-1.5 text-xs font-medium text-brand-brown hover:bg-brand-brown/5 transition-colors"
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
                            <div ref={userRef} className="relative ml-1">
                                <button
                                    onClick={() => setUserDropdownOpen((v) => !v)}
                                    className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-brand-brown/5 transition-colors hover:cursor-pointer"
                                >
                                    <img
                                        src={avatarSrc}
                                        alt={displayName}
                                        className="h-7 w-7 rounded-full border-2 border-brand-brown/20"
                                    />
                                    <span className="hidden max-w-[100px] truncate text-sm font-medium text-brand-brown md:inline">
                                        {displayName}
                                    </span>
                                    <ChevronDown className="hidden h-3.5 w-3.5 text-brand-brown/70 md:block" />
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                                        {/* User info */}
                                        <div className="px-3 py-2.5 border-b border-slate-100">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={avatarSrc}
                                                    alt={displayName}
                                                    className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                                        {displayName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <User className="h-4 w-4 text-slate-400" />
                                                Trang cá nhân
                                            </Link>
                                            <Link
                                                to="/cart"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <ShoppingCart className="h-4 w-4 text-slate-400" />
                                                Giỏ hàng
                                            </Link>
                                            <button
                                                onClick={handleOpenChangePassConfirm}
                                                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors  hover:cursor-pointer"
                                            >
                                                <KeyRound className="h-4 w-4 text-slate-400" />
                                                Đổi mật khẩu
                                            </button>
                                        </div>

                                        <hr className="border-slate-100" />

                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors  hover:cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Mobile: search bar ─────────────────────────────── */}
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
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30 transition-colors"
                            />
                        </form>

                        {(!isAuthenticated || !user) && (
                            <div className="mt-3 flex gap-2 sm:hidden">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 rounded-lg border border-slate-300 py-2 text-center text-xs font-medium text-slate-700 hover:border-brand-orange transition-colors  hover:cursor-pointer"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 rounded-lg bg-brand-orange py-2 text-center text-xs font-semibold text-brand-brown transition-colors  hover:cursor-pointer"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* ── Change Password Confirm Popup ─────────────────────── */}
            {showChangePassConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                        onClick={() => { if (changePassState === "idle") setShowChangePassConfirm(false); }}
                    />

                    {/* Dialog card */}
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        {changePassState === "sent" ? (
                            /* Success state */
                            <div className="text-center space-y-3 py-2">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CheckCircle className="h-7 w-7 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Email đã được gửi!</h3>
                                <p className="text-sm text-slate-500">
                                    Kiểm tra hộp thư{" "}
                                    <span className="font-medium text-slate-700">{user?.email}</span>{" "}
                                    để lấy link đổi mật khẩu.
                                </p>
                            </div>
                        ) : (
                            /* Confirm state */
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="rounded-full bg-brand-orange/10 p-3">
                                        <KeyRound className="h-6 w-6 text-brand-orange" />
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 text-center mb-1.5">
                                    Xác nhận đổi mật khẩu
                                </h3>
                                <p className="text-sm text-slate-500 text-center mb-6">
                                    Chúng tôi sẽ gửi link đổi mật khẩu đến{" "}
                                    <span className="font-medium text-slate-700 break-all">{user?.email}</span>.
                                    Bạn có muốn tiếp tục?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowChangePassConfirm(false)}
                                        disabled={changePassState === "loading"}
                                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 transition-colors"
                                    >
                                        Huỷ
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={changePassState === "loading"}
                                        className="flex-1 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 disabled:opacity-60 transition-colors"
                                    >
                                        {changePassState === "loading" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Đang gửi...
                                            </span>
                                        ) : (
                                            "Xác nhận"
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
