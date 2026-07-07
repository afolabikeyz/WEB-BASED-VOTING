import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Phone, BookOpen } from "lucide-react";

const FACULTIES = [
  "Engineering Technology",
  "Environmental Studies",
  "Business Studies",
  "Science & Technology",
  "Agricultural Technology",
  "Art, Design & Printing",
  "Administration & Management",
  "Liberal Studies",
  "Health Technology",
];

const DEPARTMENTS_BY_FACULTY: Record<string, string[]> = {
  "Engineering Technology": ["Electrical/Electronic Engineering", "Mechanical Engineering", "Civil Engineering", "Computer Engineering"],
  "Environmental Studies": ["Architecture", "Estate Management", "Urban & Regional Planning", "Quantity Surveying"],
  "Business Studies": ["Accountancy", "Business Administration", "Marketing", "Banking & Finance"],
  "Science & Technology": ["Computer Science", "Statistics", "Mathematics", "Physics", "Chemistry"],
  "Agricultural Technology": ["Agricultural Technology", "Food Technology", "Fisheries Technology"],
  "Art, Design & Printing": ["Fine Art", "Graphic Design", "Printing Technology"],
  "Administration & Management": ["Public Administration", "Office Technology & Management"],
  "Liberal Studies": ["Mass Communication", "Library & Information Science"],
  "Health Technology": ["Medical Laboratory Science", "Nursing Science", "Pharmacy Technology"],
};

type Tab = "login" | "register";

export function Login() {
  const [tab, setTab] = useState<Tab>("login");

  // Login fields
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register fields
  const [regMatric, setRegMatric] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regFaculty, setRegFaculty] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(matricNumber.trim().toUpperCase(), password);
      navigate("/auth/otp");
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }

    setRegLoading(true);
    try {
      const result = await register({
        matricNumber: regMatric,
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        faculty: regFaculty,
        department: regDepartment,
        password: regPassword,
      });
      setNeedsEmailConfirmation(result?.needsEmailConfirmation ?? false);
      setRegSuccess(true);
    } catch (err: any) {
      setRegError(err.message || "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">AOPE SecureVote</h1>
          <p className="text-gray-600 text-sm">Adeseun Ogundoyin Polytechnic, Eruwa</p>
          <p className="text-xs text-gray-500 mt-1">Student Union Government Elections 2026</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "login" ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => { setTab("login"); setLoginError(""); }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "register" ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => { setTab("register"); setRegError(""); setRegSuccess(false); }}
          >
            Register
          </button>
        </div>

        {/* Login Card */}
        {tab === "login" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Secure Login</h2>
              <p className="text-sm text-gray-600">Enter your credentials to access the voting platform</p>
            </div>

            {loginError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matriculation Number</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="e.g. AOPE/2021/001"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loginLoading ? "Authenticating..." : "Continue to OTP Verification"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                Multi-Factor Authentication Enabled
              </p>
              <p className="text-xs text-gray-500">
                Students must register before logging in. Use your matric number and chosen password.
              </p>
            </div>
          </div>
        )}

        {/* Register Card */}
        {tab === "register" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Student Registration</h2>
              <p className="text-sm text-gray-600">Create your voter account to participate in the election</p>
            </div>

            {regSuccess ? (
              <div className="text-center py-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${needsEmailConfirmation ? "bg-amber-100" : "bg-green-100"}`}>
                  <CheckCircle className={`h-8 w-8 ${needsEmailConfirmation ? "text-amber-600" : "text-green-600"}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {needsEmailConfirmation ? "Almost there!" : "Registration Successful!"}
                </h3>
                {needsEmailConfirmation ? (
                  <div className="text-sm text-gray-600 mb-6 space-y-2">
                    <p>A confirmation link has been sent to:</p>
                    <p className="font-semibold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg">{regEmail}</p>
                    <p className="text-xs text-gray-500">Click the link in that email to activate your account, then return here to log in.</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-6">Your account has been created. You can now log in to vote.</p>
                )}
                <button
                  onClick={() => { setTab("login"); setRegSuccess(false); setMatricNumber(regMatric); }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {needsEmailConfirmation ? "I've confirmed my email — Go to Login" : "Go to Login"}
                </button>
              </div>
            ) : (
              <>
                {regError && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{regError}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matriculation Number *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={regMatric}
                        onChange={(e) => setRegMatric(e.target.value.toUpperCase())}
                        placeholder="AOPE/2021/001"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="As it appears on your ID card"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={regFaculty}
                        onChange={(e) => { setRegFaculty(e.target.value); setRegDepartment(""); }}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                        required
                      >
                        <option value="">Select your faculty</option>
                        {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  {regFaculty && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        required
                      >
                        <option value="">Select your department</option>
                        {(DEPARTMENTS_BY_FACULTY[regFaculty] || []).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors mt-2"
                  >
                    {regLoading ? "Registering..." : "Create Voter Account"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is a secure voting platform. All activities are monitored and logged.</p>
          <p className="mt-1">© 2026 AOPE. Protected by end-to-end encryption.</p>
        </div>
      </div>
    </div>
  );
}
