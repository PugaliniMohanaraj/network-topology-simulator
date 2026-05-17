import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ui/ToastContainer";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import DashboardPage from "./pages/DashboardPage";
import DesignerPage from "./pages/DesignerPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";
import "./styles/pages.css";
import "./styles/designer.css";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/designer"
              element={
                <ReactFlowProvider>
                  <DesignerPage />
                </ReactFlowProvider>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
