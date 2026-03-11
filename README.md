# E-Shop Web (Frontend)

E-Shop Web là frontend cho hệ thống thương mại điện tử E-Shop, được build bằng **React + TypeScript + Vite**, sử dụng **OpenAPI client** sinh từ Ecom Web API làm data layer chính.

## 1. Tech stack

- **Core**
  - React 19, ReactDOM 19
  - React Router 7
  - TypeScript 5
  - Vite (dev server trên port `3101`)

- **State & data layer**
  - Redux Toolkit (auth slice, global state)
  - RTK Query cho data fetching
  - OpenAPI Typescript Codegen (`openapi-typescript-codegen`) – generate client từ `openapi.json`

- **UI & UX**
  - Tailwind CSS v4 (CSS-first, dùng `@theme` để định nghĩa màu brand)
  - Custom design system: `Button`, `Badge`, `Header`, `Footer`, `MainLayout`, `Sidebar`
  - Màu brand:
    - `brand-orange`: `#fdc648` (E-)
    - `brand-brown`: `#3b1e08` (Shop)
    - Thêm `success`, `danger`, `bg-dark` cho trạng thái

- **Forms & validation**
  - `react-hook-form`
  - `zod`
  - `@hookform/resolvers` (kết nối zod với RHF)

- **Khác**
  - `lucide-react` cho icon
  - ESLint cấu hình sẵn cho React + TS + Vite

## 2. Cấu trúc thư mục chính

```txt
EcomWeb/
  src/
    app/
      store.ts        # Redux store
      hooks.ts        # useAppDispatch, useAppSelector
    api/
      client/         # OpenAPI generated client (core, models, services)
        core/
        models/
        services/
        openapi-config.ts  # config OpenAPI.BASE, OpenAPI.TOKEN
    assets/
      logo.png
      nontext-logo.png
    components/
      layout/
        Header.tsx
        Footer.tsx
        MainLayout.tsx
        Sidebar.tsx
      ui/
        button.tsx    # Button với variant: primary, outline, success, danger
        badge.tsx     # Badge cho brand/category
    features/
      auth/
        components/
          LoginForm.tsx
        pages/
          LoginPage.tsx
        slices/
          authSlice.ts # lưu accessToken/refreshToken, isAuthenticated
    pages/
      HomePage.tsx     # Trang home show sản phẩm (mock) cho guest & customer
    main.tsx
    App.tsx
    index.css          # Tailwind import + @theme màu brand
  openapi.json         # OpenAPI spec export từ Ecom Web API
  vite.config.ts
  tsconfig*.json
  eslint.config.js
  ```
## 3. OpenAPI client
Client được generate từ file openapi.json bằng openapi-typescript-codegen.
Script trong package.json:
```json
...
"scripts": {
  "generate:api": "openapi --input ./openapi.json --output src/api/client --client axios"
}
...
```
Flow:
1. BE Ecom Web API expose swagger (/swagger/v1/swagger.json).
2. Copy JSON đó về FE thành openapi.json.
3. Chạy:
```bash
npm run generate:api
```
4. Code generate nằm trong src/api/client:
- `core/` - OpenAPI, request, CancelablePromise, ...
- `models` - LoginRequest, TokenResponse, ...
- `services` - AuthenticationsService, ...

Config client dùng `OpenAPI.BASE` + `OpenAPI.TOKEN`:
```ts
// src/api/client/openapi-config.ts
import { OpenAPI } from "./core/OpenAPI";

OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// mỗi request sẽ lấy token mới nhất từ localStorage
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") ?? "";
};
```
openapi-config.ts được import một lần trong main.tsx, nên toàn bộ service generate sẽ tự dùng baseURL + token.
## 4. Môi trường & cấu hình
### 4.1 Env
Tạo file `.env.development.local` trong `EcomWeb`:
```bash
VITE_API_BASE_URL=your-be-localhost #https://localhost:7010
```
- VITE_API_BASE_URL trỏ tới Ecom Web API.
- Dev server Vite chạy ở `http://localhost:3101`.
### 4.2. Port Vite
Trong `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3101,  #custome your port
  },
});
```
## 5. Cách chạy project
```bash
# cài dependency
npm install

# generate OpenAPI client (nếu chưa có src/api/client hoặc swagger thay đổi)
# nhớ copy json mới ở be-localhost/swagger/v1/swagger.json vào openapi.json
npm run generate:api

# dev
npm run dev
```
