import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import logo from "../assets/nonbg-logo.png";

export default function RegisterPage() {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.roleName === "Admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="flex min-h-screen">
            {/* Left — branding panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-bg-warm px-12">
                <div className="max-w-md text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-24 w-auto mb-6" />
                    <h1 className="text-3xl font-bold text-brand-brown mb-3">
                        Tham gia cùng{" "}
                        <span className="text-brand-orange">E-</span>Shop
                    </h1>
                    <p className="text-brand-brown/70 text-sm leading-relaxed">
                        Tạo tài khoản để trải nghiệm mua sắm trực tuyến với hàng ngàn
                        sản phẩm chất lượng, giá tốt nhất thị trường.
                    </p>
                </div>
            </div>

            {/* Right — register form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-bg-warm px-6 py-12">
                {/* Mobile-only logo */}
                <div className="lg:hidden mb-8 text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-16 w-auto mb-3" />
                    <h1 className="text-xl font-bold text-brand-brown">
                        <span className="text-brand-orange">E-</span>Shop
                    </h1>
                </div>

                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900 mb-1">
                            Tạo tài khoản
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Điền thông tin để đăng ký tài khoản mới
                        </p>
                        <RegisterForm />
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} E-Shop. Bảo lưu mọi quyền.
                    </p>
                </div>
            </div>
        </div>
    );
}
