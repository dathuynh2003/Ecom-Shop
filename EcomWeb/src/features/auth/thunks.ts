import { createAsyncThunk } from "@reduxjs/toolkit";
import { UsersService } from "../../api/client/services/UsersService";
import type { GetUserInfoResponseApiResponse } from "../../api/client/models/GetUserInfoResponseApiResponse";
import { AuthenticationsService, type GetUserInfoResponse, type LoginRequest, type RegisterRequest, type RegisterResponse, type TokenResponse } from "../../api/client";
import { clearTokens, setTokens, setUser } from "./slices/authSlice";

export const fetchMeThunk = createAsyncThunk<GetUserInfoResponse>(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const res: GetUserInfoResponseApiResponse =
                await UsersService.getApiV1UsersMe();
            const user = res.data as GetUserInfoResponse;
            return user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const loginThunk = createAsyncThunk<GetUserInfoResponse, LoginRequest>(
    "auth/login",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsLogin(payload);
            if (!res.success || !res.data?.accessToken) {
                if (res.message == "Email not verified.") {
                    return rejectWithValue("Tài khoản chưa được xác thực email");
                }
                return rejectWithValue("Đăng nhập thất bại");
            }
            dispatch(setTokens(res.data as TokenResponse));

            const meRes: GetUserInfoResponseApiResponse =
                await UsersService.getApiV1UsersMe();
            const user = meRes.data as GetUserInfoResponse;
            dispatch(setUser(user));
            return user as GetUserInfoResponse;
        } catch (err) {
            return rejectWithValue("Đăng nhập thất bại");
        }
    }
);

export const logoutThunk = createAsyncThunk<boolean>(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsLogout();
            if (!res.success) {
                return rejectWithValue(false);
            }
            dispatch(clearTokens());
            return true;
        } catch (err) {
            return rejectWithValue(false);
        }
    }
);

export const registerThunk = createAsyncThunk<RegisterResponse, RegisterRequest>(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsRegister(payload);
            if (!res.success || !res.data) {
                return rejectWithValue(res.message ?? "Đăng ký thất bại");
            }
            return res.data as RegisterResponse;
        } catch {
            return rejectWithValue("Đăng ký thất bại");
        }
    }
);

export const resendVerificationThunk = createAsyncThunk<string, string>(
    "auth/resendVerification",
    async (email, { rejectWithValue }) => {
        try {
            const res = await AuthenticationsService.postApiV1AuthenticationsResendVerificationEmail(email);
            if (!res.success) {
                return rejectWithValue(res.message ?? "Gửi lại thất bại");
            }
            return res.message ?? "Đã gửi lại email xác thực";
        } catch {
            return rejectWithValue("Gửi lại thất bại");
        }
    }
);
