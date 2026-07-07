import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";
import { Shield, Smartphone, Mail, AlertCircle, Check, Info } from "lucide-react";

export function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendOtp, setResendOtp] = useState<string | null>(null);
  const { verifyOTP, resendOTP, authStage, otpInfo } = useAuthStore();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (authStage !== "otp") navigate("/login");
  }, [authStage, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digits = otp.split("");
    digits[index] = value;
    const updated = digits.join("");
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (updated.replace(/\s/g, "").length === 6) handleVerify(updated);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpToVerify?: string) => {
    const otpValue = (otpToVerify || otp).trim();
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const success = await verifyOTP(otpValue);
      if (success) navigate("/auth/face");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp("");
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const newOtp = await resendOTP();
      setResendOtp(newOtp);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      setOtp("");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    }
  };

  const displayOtp = resendOtp || otpInfo?.devOtp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="w-16 sm:w-24 h-1 bg-green-600" />
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div className="w-16 sm:w-24 h-1 bg-gray-300" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">3</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 sm:gap-12 mt-2 text-xs text-gray-600">
            <span>Login</span>
            <span className="font-medium text-blue-600">OTP</span>
            <span>Face ID</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to your registered contact
          </p>
          {otpInfo && (
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{otpInfo.maskedEmail}</span>
              {otpInfo.maskedPhone && (
                <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />{otpInfo.maskedPhone}</span>
              )}
            </div>
          )}
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Dev OTP hint banner */}
          {displayOtp && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Testing Mode</p>
                <p className="text-xs text-amber-700">
                  Your OTP code: <span className="font-mono font-bold text-amber-900 text-sm">{displayOtp}</span>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors mb-4"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend verification code"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Your OTP is valid for 10 minutes
            </p>
            <p>Didn't receive the code? Check your spam folder or click resend.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/login")} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
