import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { OTPVerification } from './pages/OTPVerification';
import { FaceVerification } from './pages/FaceVerification';
import { Dashboard } from './pages/Dashboard';
import { VotingPage } from './pages/VotingPage';
import { Analytics } from './pages/Analytics';
import { Candidates } from './pages/Candidates';
import { AuditLogs } from './pages/AuditLogs';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/otp" element={<OTPVerification />} />
        <Route path="/auth/face" element={<FaceVerification />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/vote" element={<ProtectedRoute><VotingPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
