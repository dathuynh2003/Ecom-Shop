import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GetUserInfoResponse, TokenResponse } from "../../../api/client";
import { fetchMeThunk } from "../thunks";

interface AuthState {
    isAuthenticated: boolean;
    user: GetUserInfoResponse | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Dùng khi login hoặc refresh token thành công để cập nhật token người dùng
        setTokens(
            state,
            action: PayloadAction<TokenResponse>
        ) {
            localStorage.setItem("access_token", action.payload.accessToken ?? "");
            localStorage.setItem("refresh_token", action.payload.refreshToken ?? "");
            state.isAuthenticated = true;
        },
        // Dùng khi logout hoặc token hết hạn để xóa token và cập nhật trạng thái
        clearTokens(state) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            state.isAuthenticated = false;
            state.user = null;
        },
        setUser(state, action: PayloadAction<GetUserInfoResponse>) {
            state.user = action.payload;
            // Cập nhật trạng thái xác thực dựa trên việc có thông tin người dùng hay không
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMeThunk.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(fetchMeThunk.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        });
    }
});

export const { setTokens, clearTokens, setUser } = authSlice.actions;
export default authSlice.reducer;
