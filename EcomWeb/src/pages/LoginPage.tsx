import { LoginForm } from "../features/auth/components/LoginForm";
import { useAppSelector } from "../app/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            // nếu đã login thì không cho ở lại /login nữa
            if (user.roleName === "Admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="mb-1 text-xl font-semibold">
                    <span className="text-brand-orange">E-</span>
                    <span className="text-brand-brown">Shop</span> Login
                </h1>
                <p className="mb-4 text-xs text-slate-500">
                    Đăng nhập để quản lý đơn hàng và tài khoản của bạn.
                </p>
                <LoginForm />
            </div>
        </div>
    );
}
