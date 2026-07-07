import { create } from "zustand";
import { api, RegisterPayload } from "../../lib/api";
import { useSecurityStore } from "./securityStore";

export type UserRole = "student" | "electoral_officer" | "admin";

export interface User {
  id: string;
  matricNumber: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  faculty: string;
  department: string;
  faceVerified: boolean;
}

interface OtpInfo {
  maskedEmail: string;
  maskedPhone: string;
  devOtp: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authStage: "login" | "otp" | "face" | "complete";
  tempMatric: string | null;
  otpInfo: OtpInfo | null;
  login: (matricNumber: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ needsEmailConfirmation: false }>;
  verifyOTP: (otp: string) => Promise<boolean>;
  resendOTP: () => Promise<string>;
  verifyFace: () => Promise<boolean>;
  logout: () => void;
  setAuthStage: (stage: "login" | "otp" | "face" | "complete") => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  authStage: "login",
  tempMatric: null,
  otpInfo: null,

  register: async (payload: RegisterPayload) => {
    return await api.register(payload);
  },

  login: async (matricNumber: string, password: string) => {
    const sec = useSecurityStore.getState();
    try {
      const result = await api.login(matricNumber, password);
      sec.logLoginSuccess(result.user.matricNumber);
      set({
        user: result.user as User,
        tempMatric: result.user.matricNumber,
        otpInfo: {
          maskedEmail: result.maskedEmail,
          maskedPhone: result.maskedPhone,
          devOtp: result.otp,
        },
        authStage: "otp",
      });
      return true;
    } catch (err) {
      sec.logLoginFailure(matricNumber);
      throw err;
    }
  },

  verifyOTP: async (otp: string) => {
    const { tempMatric } = get();
    const sec = useSecurityStore.getState();
    if (!tempMatric) return false;
    try {
      await api.verifyOtp(tempMatric, otp);
      sec.logOTPSuccess(tempMatric);
      set({ authStage: "face" });
      return true;
    } catch (err) {
      sec.logOTPFailure(tempMatric);
      throw err;
    }
  },

  resendOTP: async () => {
    const { tempMatric } = get();
    if (!tempMatric) throw new Error("No active session");
    const otp = await api.resendOtp(tempMatric);
    set((state) => ({
      otpInfo: state.otpInfo ? { ...state.otpInfo, devOtp: otp } : null,
    }));
    return otp;
  },

  verifyFace: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { tempMatric } = get();
    const sec = useSecurityStore.getState();
    if (tempMatric) sec.logFaceVerified(tempMatric);
    sec.incrementSessions();
    set({ isAuthenticated: true, authStage: "complete", tempMatric: null });
    return true;
  },

  logout: () => {
    useSecurityStore.getState().decrementSessions();
    set({
      user: null,
      isAuthenticated: false,
      authStage: "login",
      tempMatric: null,
      otpInfo: null,
    });
  },

  setAuthStage: (stage) => set({ authStage: stage }),
}));
