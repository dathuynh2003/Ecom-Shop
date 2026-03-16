import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
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
      {/* Auth (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Public pages with sidebar */}
      <Route
        path="/"
        element={
          <MainLayout withSidebar>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/:categorySlug"
        element={
          <MainLayout withSidebar>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/:categorySlug/:brandSlug"
        element={
          <MainLayout withSidebar>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/:categorySlug/:brandSlug/:productSlug"
        element={
          <MainLayout>
            <ProductDetailsPage />
          </MainLayout>
        }
      />

      {/* Protected: Customer */}
      <Route element={<ProtectedRoute allowRoles={["Customer", "Admin"]} />}>
        <Route
          path="/profile"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
      </Route>

      {/* Protected: Admin */}
      <Route element={<ProtectedRoute allowRoles={["Admin"]} />}>
        <Route
          path="/admin/*"
          element={
            <MainLayout withSidebar>
              <HomePage />
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
