// src/features/auth/components/LoginForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { loginThunk } from "../thunks";
import type { LoginRequest } from "../../../api/client";

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

        const body: LoginRequest = {
            account: values.account,
            password: values.password,
        };

        const resultAction = await dispatch(loginThunk(body));

        if (loginThunk.rejected.match(resultAction)) {
            // payload trong rejectWithValue("...") là string
            const msg = (resultAction.payload as string) ?? "Login failed";
            setApiError(msg);
            return;
        }

        // loginThunk.fulfilled: token đã lưu + /Users/me đã fetch + setUser rồi
        // Điều hướng thực tế được xử lý ở LoginPage (useEffect), nên ở đây không cần navigate
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
