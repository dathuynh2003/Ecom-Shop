import { OpenAPI } from "./core/OpenAPI";

// base URL backend
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// mỗi request sẽ gọi hàm này => luôn lấy token mới nhất từ localStorage
OpenAPI.TOKEN = async () => {
    return localStorage.getItem("access_token") ?? "";
};
