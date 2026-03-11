import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Role = "Admin" | "Customer" | "Staff";

interface ProtectedRouteProps {
    requireAuth?: boolean;      // mặc định true
    allowRoles?: Role[];        // nếu set, chỉ cho các role này
}

export function ProtectedRoute({
    requireAuth = true,
    allowRoles,
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const location = useLocation();

    // Guest route (requireAuth = false): luôn cho vào, không check gì
    if (!requireAuth) {
        return <Outlet />;
    }

    // Cần login mà chưa login
    if (!isAuthenticated || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Nếu có giới hạn role
    if (allowRoles && !allowRoles.includes(user.roleName as Role)) {
        // tuỳ bạn, có thể chuyển về / hoặc trang 403
        return <Navigate to="/" replace />;
    }

    // OK, render child routes
    return <Outlet />;
}
