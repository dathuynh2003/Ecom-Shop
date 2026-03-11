import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { setTokens } from "../slices/authSlice";
import {
    AuthenticationsService,
    type LoginRequest,
} from "../../../api/client";

const schema = z.object({
    account: z.string().min(1, "Account is required"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
    const dispatch = useAppDispatch();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setApiError(null);
        try {
            const body: LoginRequest = {
                account: values.account,
                password: values.password,
            };

            const res = await AuthenticationsService.postApiV1AuthenticationsLogin(
                body
            );

            if (!res.success || !res.data || !res.data.accessToken) {
                setApiError(res.message ?? "Login failed");
                return;
            }

            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken ?? "";

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            dispatch(setTokens({ accessToken, refreshToken }));
            // TODO: điều hướng sang trang home/dashboard sau này
        } catch (e: any) {
            setApiError("Login error");
            console.error(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-sm"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Account</label>
                <input
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    {...register("account")}
                />
                {errors.account && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.account.message?.toString()}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                    type="password"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.password.message?.toString()}
                    </p>
                )}
            </div>

            {apiError && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded px-2 py-1">
                    {apiError}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
