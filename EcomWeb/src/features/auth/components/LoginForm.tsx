import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { loginThunk } from "../thunks";
import type { LoginRequest } from "../../../api/client";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const schema = z.object({
    account: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
    const dispatch = useAppDispatch();
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setApiError(null);

        const body: LoginRequest = {
            account: values.account,
            password: values.password,
        };

        const resultAction = await dispatch(loginThunk(body));

        if (loginThunk.rejected.match(resultAction)) {
            const msg =
                (resultAction.payload as string) ?? "Đăng nhập thất bại";
            setApiError(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account */}
            <div>
                <label
                    htmlFor="account"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                    Email hoặc số điện thoại
                </label>
                <input
                    id="account"
                    type="text"
                    placeholder="example@email.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                    {...register("account")}
                />
                {errors.account && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.account.message?.toString()}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Mật khẩu
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="your password"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <div className="flex items-center justify-between my-2">
                    <div
                        className="block text-sm font-medium text-slate-700"
                    >
                    </div>
                    <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-brand-orange hover:text-brand-brown transition-colors"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.password.message?.toString()}
                    </p>
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
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-slate-500">
                Chưa có tài khoản?{" "}
                <Link
                    to="/register"
                    className="font-medium text-brand-brown hover:text-brand-orange transition-colors"
                >
                    Đăng ký ngay
                </Link>
            </p>
        </form>
    );
}
