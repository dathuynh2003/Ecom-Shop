// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { fetchMeThunk } from "./features/auth/thunks";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (access && refresh) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch]);
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
      />
      <Route
        path="/"
        element={
          <MainLayout withSidebar>
            <HomePage />
          </MainLayout>
        }
      />
      {/* Admin area: cần login + role Admin */}
      <Route element={<ProtectedRoute allowRoles={["Admin"]} />}>
        <Route
          path="/admin/*"
          element={
            <MainLayout withSidebar>
              {/* <AdminRoutes /> hoặc tạm thời HomePage */}
              <HomePage />
            </MainLayout>
          }
        />
      </Route>

      {/* Có thể thêm ProtectedRoute cho customer-only pages nếu cần: */}
      {/* <Route element={<ProtectedRoute allowRoles={["Customer"]} />}>
        <Route
          path="/account"
          element={
            <MainLayout>
              <AccountPage />
            </MainLayout>
          }
        />
      </Route> */}

    </Routes>
  );
}

export default App;
