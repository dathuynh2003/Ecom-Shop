import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";
import { AuthenticationsService } from "../api/client/services/AuthenticationsService";
import type { ResetPasswordRequest } from "../api/client";
import logo from "../assets/nonbg-logo.png";
import { useAppDispatch } from "../app/hooks";
import { clearTokens } from "../features/auth/slices/authSlice";

const schema = z
    .object({
        newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const token = searchParams.get("token") ?? "";

    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        setApiError(null);

        if (!token) {
            setApiError("Link đặt lại mật khẩu không hợp lệ.");
            return;
        }

        const body: ResetPasswordRequest = {
            token,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        };

        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsResetPassword(body);
            if (res.success) {
                dispatch(clearTokens());
                setIsSuccess(true);
            } else {
                setApiError(res.message ?? "Đặt lại mật khẩu thất bại.");
            }
        } catch {
            setApiError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const isTokenError =
        apiError === "Invalid token." ||
        apiError === "Link đặt lại mật khẩu không hợp lệ.";

    return (
        <div className="flex min-h-screen">
            {/* Left — branding (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-brand-orange/20 via-brand-orange/10 to-bg-warm px-12">
                <div className="max-w-md text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-24 w-auto mb-6" />
                    <h1 className="text-3xl font-bold text-brand-brown mb-3">
                        Đặt lại mật khẩu
                    </h1>
                    <p className="text-brand-brown/70 text-sm leading-relaxed">
                        Tạo mật khẩu mới an toàn để bảo vệ tài khoản của bạn.
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
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Đặt lại mật khẩu thành công!
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại với mật khẩu mới.
                                </p>
                                <Link
                                    to="/login"
                                    className="block w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 transition-colors text-center"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        ) : (
                            /* ── Form state ── */
                            <>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="rounded-full bg-brand-orange/10 p-2">
                                        <KeyRound className="h-5 w-5 text-brand-orange" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 leading-tight">
                                            Đặt lại mật khẩu
                                        </h2>
                                        <p className="text-xs text-slate-500">Link có hiệu lực trong 15 phút.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Tối thiểu 6 ký tự"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                                                {...register("newPassword")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Nhập lại mật khẩu"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                                                {...register("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    {/* API Error */}
                                    {apiError && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 space-y-1">
                                            <p className="text-xs text-red-600">{apiError}</p>
                                            {isTokenError && (
                                                <Link
                                                    to="/forgot-password"
                                                    className="text-xs font-medium text-brand-orange hover:text-brand-brown transition-colors"
                                                >
                                                    Yêu cầu link mới →
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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
