import { create } from 'zustand';

export type EventType = 'threat' | 'warning' | 'info' | 'success';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  severity: Severity;
}

export interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: string;
}

// Simulate a plausible random IP for events
function randomIP(): string {
  const pools = ['203.45', '45.67', '123.45', '89.101', '196.12', '41.58'];
  const base = pools[Math.floor(Math.random() * pools.length)];
  return `${base}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface SecurityState {
  events: SecurityEvent[];
  blockedIPs: BlockedIP[];
  activeSessions: number;
  failedLogins: number;
  successfulLogins: number;
  mfaSuccesses: number;
  mfaFailures: number;

  logEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
  logLoginSuccess: (matricNumber: string) => void;
  logLoginFailure: (matricNumber: string) => void;
  logOTPSuccess: (matricNumber: string) => void;
  logOTPFailure: (matricNumber: string) => void;
  logFaceVerified: (matricNumber: string) => void;
  blockIP: (ip: string, reason: string) => void;
  unblockIP: (ip: string) => void;
  incrementSessions: () => void;
  decrementSessions: () => void;
}

export const useSecurityStore = create<SecurityState>((set, get) => ({
  events: [
    {
      id: 'seed-1',
      type: 'warning',
      title: 'Multiple Failed Login Attempts',
      description: `IP ${randomIP()} attempted login 5 times with incorrect credentials`,
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      severity: 'high',
    },
    {
      id: 'seed-2',
      type: 'info',
      title: 'System Startup',
      description: 'AOPE SecureVote platform initialised and security monitoring active',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      severity: 'low',
    },
    {
      id: 'seed-3',
      type: 'threat',
      title: 'Suspicious IP Activity',
      description: `Potential automated access detected from IP ${randomIP()}`,
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      severity: 'critical',
    },
  ],
  blockedIPs: [
    { ip: '203.45.67.89', reason: 'Multiple failed logins', blockedAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { ip: '45.67.89.101', reason: 'Automated voting attempt', blockedAt: new Date(Date.now() - 60 * 60000).toISOString() },
  ],
  activeSessions: 0,
  failedLogins: 0,
  successfulLogins: 0,
  mfaSuccesses: 0,
  mfaFailures: 0,

  logEvent: (event) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: Math.random().toString(36).slice(2),
      timestamp: now(),
    };
    set((state) => ({ events: [newEvent, ...state.events].slice(0, 50) }));
  },

  logLoginSuccess: (matricNumber) => {
    set((state) => ({ successfulLogins: state.successfulLogins + 1 }));
    get().logEvent({
      type: 'success',
      title: 'Successful Login',
      description: `User ${matricNumber} authenticated successfully`,
      severity: 'low',
    });
  },

  logLoginFailure: (matricNumber) => {
    set((state) => ({ failedLogins: state.failedLogins + 1 }));
    const fails = get().failedLogins;
    const ip = randomIP();
    if (fails > 0 && fails % 3 === 0) {
      get().blockIP(ip, 'Repeated failed login attempts');
    }
    get().logEvent({
      type: 'warning',
      title: 'Failed Login Attempt',
      description: `Invalid credentials for ${matricNumber || 'unknown user'} from IP ${ip}`,
      severity: fails >= 3 ? 'high' : 'medium',
    });
  },

  logOTPSuccess: (matricNumber) => {
    set((state) => ({ mfaSuccesses: state.mfaSuccesses + 1 }));
    get().logEvent({
      type: 'info',
      title: 'OTP Verified',
      description: `Two-factor authentication passed for ${matricNumber}`,
      severity: 'low',
    });
  },

  logOTPFailure: (matricNumber) => {
    set((state) => ({ mfaFailures: state.mfaFailures + 1 }));
    get().logEvent({
      type: 'warning',
      title: 'OTP Verification Failed',
      description: `Invalid OTP entered for ${matricNumber}`,
      severity: 'medium',
    });
  },

  logFaceVerified: (matricNumber) => {
    get().logEvent({
      type: 'success',
      title: 'Facial Recognition Passed',
      description: `Biometric identity confirmed for ${matricNumber}`,
      severity: 'low',
    });
  },

  blockIP: (ip, reason) => {
    set((state) => {
      if (state.blockedIPs.find((b) => b.ip === ip)) return state;
      return {
        blockedIPs: [{ ip, reason, blockedAt: now() }, ...state.blockedIPs],
      };
    });
    get().logEvent({
      type: 'threat',
      title: 'IP Address Blocked',
      description: `${ip} blocked — ${reason}`,
      severity: 'high',
    });
  },

  unblockIP: (ip) => {
    set((state) => ({ blockedIPs: state.blockedIPs.filter((b) => b.ip !== ip) }));
    get().logEvent({
      type: 'info',
      title: 'IP Address Unblocked',
      description: `${ip} has been removed from the blocklist`,
      severity: 'low',
    });
  },

  incrementSessions: () => set((state) => ({ activeSessions: state.activeSessions + 1 })),
  decrementSessions: () => set((state) => ({ activeSessions: Math.max(0, state.activeSessions - 1) })),
}));
