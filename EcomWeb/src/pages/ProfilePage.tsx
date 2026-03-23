import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.png";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMeThunk, logoutThunk } from "../features/auth/thunks";

function formatDate(input?: string) {
    if (!input) return "—";
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("vi-VN");
}

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshProfile = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await dispatch(fetchMeThunk()).unwrap();
        } catch {
            setErrorMessage("Không tải được thông tin tài khoản. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            void refreshProfile();
        }
    }, [user]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await dispatch(logoutThunk());
        navigate("/login", { replace: true });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.avatarUrl || defaultAvatar}
                            alt={user?.fullName || "User avatar"}
                            className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Trang cá nhân</h1>
                            <p className="text-sm text-slate-500">
                                Quản lý thông tin tài khoản của bạn.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={refreshProfile}
                            disabled={isLoading}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                        >
                            {isLoading ? "Đang tải..." : "Làm mới"}
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-orange/90 disabled:opacity-60"
                        >
                            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Họ và tên</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{user?.fullName || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{user?.email || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Số điện thoại</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{user?.phoneNumber || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ngày sinh</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(user?.dob)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vai trò</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{user?.roleName || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mã giỏ hàng</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{user?.cartId || "—"}</p>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">Địa chỉ</h2>
                {!user?.addresses?.length ? (
                    <p className="mt-2 text-sm text-slate-500">Bạn chưa có địa chỉ nào.</p>
                ) : (
                    <ul className="mt-3 space-y-2">
                        {user.addresses.map((address) => (
                            <li
                                key={address.id}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                            >
                                {address.addressText || "—"}
                                {address.isDefault ? " (Mặc định)" : ""}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}