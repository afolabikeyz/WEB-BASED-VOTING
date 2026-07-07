// All user data is stored in localStorage with SHA-256 hashed passwords.
// No email confirmation, no RLS, no external auth dependency.

// ── Types ─────────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  matricNumber: string;
  fullName: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  password: string;
}

export interface RegisterResult {
  needsEmailConfirmation: false;
}

export interface LoginResponse {
  user: {
    id: string;
    matricNumber: string;
    fullName: string;
    email: string;
    phone: string;
    role: "student" | "electoral_officer" | "admin";
    faculty: string;
    department: string;
    faceVerified: boolean;
  };
  otp: string;
  maskedEmail: string;
  maskedPhone: string;
}

interface StoredUser {
  id: string;
  matricNumber: string;
  fullName: string;
  email: string;
  phone: string;
  role: "student" | "electoral_officer" | "admin";
  faculty: string;
  department: string;
  faceVerified: boolean;
  passwordHash: string;
  createdAt: string;
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const USERS_KEY = "aope_users_v2";

function getUsers(): Record<string, StoredUser> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}

function saveUser(user: StoredUser): void {
  const users = getUsers();
  users[user.matricNumber] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getUser(matricNumber: string): StoredUser | null {
  return getUsers()[matricNumber] ?? null;
}

// ── OTP helpers (sessionStorage, 10-min TTL) ──────────────────────────────────
function saveOtp(matric: string, otp: string): void {
  sessionStorage.setItem(`otp:${matric}`, JSON.stringify({
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  }));
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Crypto helpers ────────────────────────────────────────────────────────────
async function hashPassword(pw: string): Promise<string> {
  const buf = new TextEncoder().encode(pw + "aope_securevote_2026");
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return local.slice(0, 2) + "*".repeat(Math.max(0, local.length - 2)) + "@" + domain;
}

function maskPhone(phone: string): string {
  return phone ? phone.replace(/.(?=.{4})/g, "*") : "";
}

// ── API ───────────────────────────────────────────────────────────────────────
export const api = {
  async register(payload: RegisterPayload): Promise<RegisterResult> {
    const matricUp = payload.matricNumber.trim().toUpperCase();
    const email = payload.email.trim().toLowerCase();

    if (!matricUp) throw new Error("Matric number is required.");
    if (matricUp.startsWith("AOPE/ADMIN/") || matricUp.startsWith("AOPE/STAFF/")) {
      throw new Error("This matric number format is reserved for staff accounts.");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!payload.password || payload.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (getUser(matricUp)) {
      throw new Error("This matric number is already registered. Please log in.");
    }

    const passwordHash = await hashPassword(payload.password);
    saveUser({
      id: crypto.randomUUID(),
      matricNumber: matricUp,
      fullName: payload.fullName.trim(),
      email,
      phone: (payload.phone || "").trim(),
      role: "student",
      faculty: (payload.faculty || "").trim(),
      department: (payload.department || "").trim(),
      faceVerified: false,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    return { needsEmailConfirmation: false };
  },

  async login(matricNumber: string, password: string): Promise<LoginResponse> {
    const matricUp = matricNumber.trim().toUpperCase();
    const pw = password.trim();

    if (!matricUp || !pw) throw new Error("Matric number and password are required.");

    // ── Hardcoded admin ────────────────────────────────────────────────────────
    if (matricUp === "AOPE/ADMIN/001") {
      if (pw !== "Admin@2026") throw new Error("Invalid matric number or password.");
      const user = {
        id: "admin-001", matricNumber: "AOPE/ADMIN/001",
        fullName: "System Administrator", email: "admin@aope.edu.ng",
        phone: "+234 803 234 5678", role: "admin" as const,
        faculty: "Administration", department: "IT Department", faceVerified: true,
      };
      const otp = generateOTP();
      saveOtp(matricUp, otp);
      return { user, otp, maskedEmail: maskEmail(user.email), maskedPhone: maskPhone(user.phone) };
    }

    // ── Student lookup ─────────────────────────────────────────────────────────
    const stored = getUser(matricUp);
    if (!stored) {
      throw new Error("Matric number not registered. Please register first.");
    }

    const providedHash = await hashPassword(pw);
    if (stored.passwordHash !== providedHash) {
      throw new Error("Incorrect password. Please try again.");
    }

    const { passwordHash: _h, ...userWithoutHash } = stored;
    const otp = generateOTP();
    saveOtp(matricUp, otp);

    return {
      user: userWithoutHash,
      otp,
      maskedEmail: maskEmail(stored.email),
      maskedPhone: maskPhone(stored.phone),
    };
  },

  async verifyOtp(matricNumber: string, otp: string): Promise<void> {
    const matricUp = matricNumber.trim().toUpperCase();
    const raw = sessionStorage.getItem(`otp:${matricUp}`);
    if (!raw) throw new Error("OTP not found. Please log in again to get a new code.");
    const stored = JSON.parse(raw);
    if (new Date(stored.expiresAt) < new Date()) {
      sessionStorage.removeItem(`otp:${matricUp}`);
      throw new Error("OTP has expired. Please request a new code.");
    }
    if (stored.code !== otp.trim()) {
      throw new Error("Invalid OTP. Please check the code and try again.");
    }
    sessionStorage.removeItem(`otp:${matricUp}`);
  },

  async resendOtp(matricNumber: string): Promise<string> {
    const otp = generateOTP();
    saveOtp(matricNumber.trim().toUpperCase(), otp);
    return otp;
  },

  async getStudents(): Promise<{ users: any[] }> {
    const all = Object.values(getUsers()).map(({ passwordHash: _h, ...rest }) => rest);
    return { users: all };
  },
};
