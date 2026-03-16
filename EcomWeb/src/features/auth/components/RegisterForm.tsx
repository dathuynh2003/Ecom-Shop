import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { registerThunk, resendVerificationThunk } from "../thunks";
import type { RegisterRequest } from "../../../api/client";

const RESEND_COOLDOWN = 5 * 60; // 300 seconds

const schema = z
    .object({
        name: z.string().min(1, "Vui lòng nhập họ tên"),
        email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
        phoneNumber: z.string().min(1, "Vui lòng nhập số điện thoại"),
        dob: z.string().min(1, "Vui lòng chọn ngày sinh"),
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof schema>;

function formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export function RegisterForm() {
    const dispatch = useAppDispatch();
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [savedEmail, setSavedEmail] = useState("");

    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);

    // Tick countdown down by 1 every second
    useEffect(() => {
        if (countdown <= 0) return;
        const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [countdown]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        setApiError(null);
        const body: RegisterRequest = {
            name: values.name,
            email: values.email,
            phoneNumber: values.phoneNumber,
            dob: values.dob,
            password: values.password,
            confirmPassword: values.confirmPassword,
        };

        const result = await dispatch(registerThunk(body));

        if (registerThunk.fulfilled.match(result)) {
            setSavedEmail(values.email);
            setIsSuccess(true);
            setCountdown(RESEND_COOLDOWN); // BE vừa gửi mail → bắt đầu đếm ngược luôn
        } else {
            const msg = (result.payload as string) ?? "Đăng ký thất bại";
            if (msg === "Email already registered") {
                setError("email", { message: "Email này đã được đăng ký" });
            } else if (msg === "Phone number already in use") {
                setError("phoneNumber", { message: "Số điện thoại này đã được sử dụng" });
            } else {
                setApiError(msg);
            }
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendError(null);
        setResendSuccess(false);

        const result = await dispatch(resendVerificationThunk(savedEmail));
        setResendLoading(false);
        setCountdown(RESEND_COOLDOWN); // reset countdown dù thành công hay thất bại

        if (resendVerificationThunk.fulfilled.match(result)) {
            setResendSuccess(true);
        } else {
            setResendError((result.payload as string) ?? "Gửi lại thất bại");
        }
    };

    // ── Success state ─────────────────────────────────────────────────────────
    if (isSuccess) {
        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                        <Mail className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Kiểm tra hộp thư của bạn</h3>
                <p className="text-sm text-slate-500">
                    Chúng tôi đã gửi email xác thực đến{" "}
                    <span className="font-medium text-slate-700">{savedEmail}</span>.
                    Vui lòng click vào link trong email để hoàn tất đăng ký.
                </p>

                {resendSuccess && (
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        <p className="text-xs text-green-700">Đã gửi lại email xác thực thành công.</p>
                    </div>
                )}

                {resendError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                        <p className="text-xs text-red-600">{resendError}</p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || countdown > 0}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    {resendLoading
                        ? "Đang gửi..."
                        : countdown > 0
                        ? `Gửi lại sau ${formatCountdown(countdown)}`
                        : "Gửi lại email xác thực"}
                </button>

                <p className="text-xs text-slate-400">Link xác thực có hiệu lực trong 5 phút.</p>
                <Link
                    to="/login"
                    className="block text-sm font-medium text-brand-orange hover:text-brand-brown transition-colors"
                >
                    Quay lại đăng nhập
                </Link>
            </div>
        );
    }

    // ── Form state ────────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Họ và tên
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                    {...register("name")}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
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
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone + DOB */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Số điện thoại
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="0912345678"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Ngày sinh
                    </label>
                    <input
                        id="dob"
                        type="date"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                        {...register("dob")}
                    />
                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
                </div>
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mật khẩu
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Xác nhận mật khẩu
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
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-xs text-red-600">{apiError}</p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-medium text-brand-brown hover:text-brand-orange transition-colors">
                    Đăng nhập ngay
                </Link>
            </p>
        </form>
    );
}
