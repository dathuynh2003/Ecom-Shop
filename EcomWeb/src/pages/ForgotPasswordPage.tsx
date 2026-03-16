import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { AuthenticationsService } from "../api/client/services/AuthenticationsService";
import logo from "../assets/nonbg-logo.png";

const schema = z.object({
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        setApiError(null);
        try {
            await AuthenticationsService.postApiV1AuthenticationsRequestPasswordReset(values.email);
            // BE luôn trả success để tránh email enumeration
            setIsSuccess(true);
        } catch {
            setApiError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left — branding (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-bg-warm px-12">
                <div className="max-w-md text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-24 w-auto mb-6" />
                    <h1 className="text-3xl font-bold text-brand-brown mb-3">
                        Quên mật khẩu?
                    </h1>
                    <p className="text-brand-brown/70 text-sm leading-relaxed">
                        Đừng lo, nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu ngay.
                    </p>
                </div>
            </div>

            {/* Right — form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-bg-warm px-6 py-12">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8 text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-16 w-auto mb-3" />
                    <h1 className="text-xl font-bold text-brand-brown">
                        <span className="text-brand-orange">E-</span>Shop
                    </h1>
                </div>

                <div className="w-full max-w-sm">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        {isSuccess ? (
                            /* ── Success state ── */
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <Mail className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Kiểm tra hộp thư</h2>
                                <p className="text-sm text-slate-500">
                                    Chúng tôi đã gửi link đặt lại mật khẩu đến email{" "}
                                    <span className="font-medium text-slate-700">{getValues("email")}</span>{" "}
                                    của bạn.
                                </p>
                                <p className="text-xs text-slate-400">Link có hiệu lực trong 15 phút.</p>
                                <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <p className="text-xs text-green-700">Vui lòng kiểm tra cả thư mục spam.</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold 
                                    text-brand-brown hover:bg-brand-orange/90 focus:outline-none 
                                    focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 
                                    transition-colors text-center"
                                >
                                    Quay lại đăng nhập
                                </Link>


                            </div>
                        ) : (
                            /* ── Form state ── */
                            <>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-brown transition-colors mb-5"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Quay lại đăng nhập
                                </Link>
                                <h2 className="text-xl font-semibold text-slate-900 mb-1">Quên mật khẩu</h2>
                                <p className="text-sm text-slate-500 mb-6">
                                    Nhập email đăng ký để nhận link đặt lại mật khẩu.
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {apiError && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                            <p className="text-xs text-red-600">{apiError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} E-Shop. Bảo lưu mọi quyền.
                    </p>
                </div>
            </div>
        </div>
    );
}
