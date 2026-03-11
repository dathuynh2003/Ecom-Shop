import { OpenAPI } from "./client/core/OpenAPI";

// base URL backend
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? "";
OpenAPI.WITH_CREDENTIALS = false;

// mỗi request sẽ gọi hàm này => luôn lấy token mới nhất từ localStorage
OpenAPI.TOKEN = async () => {
    return localStorage.getItem("access_token") ?? "";
};
