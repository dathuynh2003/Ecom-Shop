import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
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

