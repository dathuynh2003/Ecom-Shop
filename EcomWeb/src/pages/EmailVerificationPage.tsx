import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { AuthenticationsService } from "../api/client/services/AuthenticationsService";
import logo from "../assets/nonbg-logo.png";

type VerifyState = "loading" | "success" | "error";

const RESEND_COOLDOWN = 5 * 60; // 300 seconds

function formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default function EmailVerificationPage() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<VerifyState>("loading");
    const [message, setMessage] = useState("");
    const hasCalledRef = useRef(false);

    const [resendEmail, setResendEmail] = useState("");
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

    // Auto-verify on mount (StrictMode safe)
    useEffect(() => {
        if (hasCalledRef.current) return;
        hasCalledRef.current = true;

        const token = searchParams.get("token");
        if (!token) {
            setState("error");
            setMessage("Link xác thực không hợp lệ hoặc đã bị thiếu token.");
            return;
        }

        AuthenticationsService.getApiV1AuthenticationsVerifyEmail(token)
            .then((res) => {
                if (res.success) {
                    setState("success");
                    setMessage(res.message ?? "Xác thực email thành công!");
                } else {
                    setState("error");
                    setMessage(res.message ?? "Xác thực thất bại.");
                }
            })
            .catch(() => {
                setState("error");
                setMessage("Đã xảy ra lỗi. Link xác thực có thể đã hết hạn.");
            });
    }, [searchParams]);

    const handleResend = async () => {
        if (!resendEmail) return;
        setResendLoading(true);
        setResendError(null);
        setResendSuccess(false);

        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsResendVerificationEmail(resendEmail);
            if (res.success) {
                setResendSuccess(true);
            } else {
                setResendError(res.message ?? "Gửi lại thất bại");
            }
        } catch {
            setResendError("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setResendLoading(false);
            setCountdown(RESEND_COOLDOWN); // reset countdown dù thành công hay thất bại
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-warm px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img src={logo} alt="E-Shop" className="mx-auto h-16 w-auto mb-3" />
                    <h1 className="text-xl font-bold text-brand-brown">
                        <span className="text-brand-orange">E-</span>Shop
                    </h1>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-4">
                    {/* Loading */}
                    {state === "loading" && (
                        <>
                            <div className="flex justify-center">
                                <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
                            </div>
                            <p className="text-sm text-slate-500">Đang xác thực email của bạn...</p>
                        </>
                    )}

                    {/* Success */}
                    {state === "success" && (
                        <>
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-100 p-3">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Xác thực thành công!</h2>
                            <p className="text-sm text-slate-500">{message}</p>
                            <Link
                                to="/login"
                                className="block w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 transition-colors text-center"
                            >
                                Đăng nhập ngay
                            </Link>
                        </>
                    )}

                    {/* Error */}
                    {state === "error" && (
                        <>
                            <div className="flex justify-center">
                                <div className="rounded-full bg-red-100 p-3">
                                    <XCircle className="h-8 w-8 text-red-500" />
                                </div>
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Xác thực thất bại</h2>
                            <p className="text-sm text-slate-500">{message}</p>

                            {/* Email input for resend */}
                            <div className="text-left space-y-1.5">
                                <label
                                    htmlFor="resend-email"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Gửi lại email xác thực
                                </label>
                                <input
                                    id="resend-email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                                />
                            </div>

                            {resendSuccess && (
                                <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <p className="text-xs text-green-700">
                                        Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.
                                    </p>
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
                                disabled={resendLoading || countdown > 0 || !resendEmail}
                                className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-orange/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {resendLoading
                                    ? "Đang gửi..."
                                    : countdown > 0
                                    ? `Gửi lại sau ${formatCountdown(countdown)}`
                                    : "Gửi lại email xác thực"}
                            </button>

                            <div className="flex justify-center gap-4 text-sm pt-1">
                                <Link
                                    to="/register"
                                    className="font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    Đăng ký lại
                                </Link>
                                <span className="text-slate-300">|</span>
                                <Link
                                    to="/login"
                                    className="font-medium text-brand-orange hover:text-brand-brown transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} E-Shop. Bảo lưu mọi quyền.
                </p>
            </div>
        </div>
    );
}
