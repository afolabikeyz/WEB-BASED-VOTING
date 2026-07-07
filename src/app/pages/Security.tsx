import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useSecurityStore } from '../store/securityStore';
import {
  Shield, AlertTriangle, CheckCircle, Lock, Eye,
  UserX, Globe, Activity, Clock, Plus, X, Wifi
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Security() {
  const {
    events, blockedIPs, activeSessions,
    failedLogins, successfulLogins, mfaSuccesses, mfaFailures,
    blockIP, unblockIP, logEvent,
  } = useSecurityStore();

  const [blockIPInput, setBlockIPInput] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [showBlockForm, setShowBlockForm] = useState(false);

  const mfaRate = mfaSuccesses + mfaFailures === 0
    ? '100%'
    : `${((mfaSuccesses / (mfaSuccesses + mfaFailures)) * 100).toFixed(1)}%`;

  const stats = [
    { label: 'Active Sessions', value: activeSessions.toString(), icon: Activity, color: 'blue', trend: `+${activeSessions}` },
    { label: 'Failed Logins', value: failedLogins.toString(), icon: AlertTriangle, color: 'yellow', trend: failedLogins > 0 ? `+${failedLogins}` : '0' },
    { label: 'Blocked IPs', value: blockedIPs.length.toString(), icon: UserX, color: 'red', trend: `+${blockedIPs.length}` },
    { label: 'MFA Success Rate', value: mfaRate, icon: CheckCircle, color: 'green', trend: `+${mfaSuccesses}` },
  ];

  const handleBlockIP = () => {
    if (!blockIPInput.trim()) return;
    blockIP(blockIPInput.trim(), blockReason.trim() || 'Manually blocked by admin');
    setBlockIPInput('');
    setBlockReason('');
    setShowBlockForm(false);
  };

  const handleSimulateAttack = () => {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    logEvent({
      type: 'threat',
      title: 'Intrusion Attempt Detected',
      description: `Brute-force pattern detected from IP ${ip} — 10 requests in 5 seconds`,
      severity: 'critical',
    });
  };

  const severityColors: Record<string, string> = {
    critical: 'border-red-600 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-blue-500 bg-blue-50',
  };

  const severityBadge: Record<string, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  const typeIcon: Record<string, JSX.Element> = {
    threat: <AlertTriangle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    info: <Shield className="h-5 w-5 text-blue-600" />,
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
  };

  const typeIconBg: Record<string, string> = {
    threat: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    success: 'bg-green-100',
  };

  return (
    <Layout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of platform security</p>
        </div>
        <button
          onClick={handleSimulateAttack}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors border border-red-200"
        >
          <Wifi className="h-4 w-4" />
          Simulate Attack
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
          };
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${colorMap[stat.color]} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">live</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Security Status Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Security Status</h2>
          <div className="space-y-3">
            {[
              { label: 'SSL/TLS Encryption', status: 'Active', icon: Lock },
              { label: 'Firewall Protection', status: 'Active', icon: Shield },
              { label: 'DDoS Mitigation', status: 'Active', icon: Shield },
              { label: 'Intrusion Detection', status: 'Monitoring', icon: Eye },
              { label: 'Audit Logging', status: 'Active', icon: Activity },
              { label: 'Data Encryption', status: 'AES-256', icon: Lock },
            ].map(({ label, status, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{status}</p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Authentication Security</h2>
          <div className="space-y-3">
            {[
              { label: 'Multi-Factor Authentication', status: 'Enforced', icon: CheckCircle },
              { label: 'Facial Recognition', status: 'Active', icon: Eye },
              { label: 'OTP Verification', status: 'Session-bound', icon: CheckCircle },
              { label: 'Device Binding', status: 'Enabled', icon: Shield },
              { label: 'Session Management', status: 'Secure', icon: Clock },
              { label: 'Password Policy', status: 'Min 8 chars', icon: Lock },
            ].map(({ label, status, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{status}</p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Security Events */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Live Security Events
            <span className="ml-2 text-sm font-normal text-gray-500">({events.length})</span>
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {events.map((event) => (
            <div key={event.id} className={`p-4 rounded-lg border-l-4 ${severityColors[event.severity]}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full ${typeIconBg[event.type]} flex items-center justify-center flex-shrink-0`}>
                  {typeIcon[event.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${severityBadge[event.severity]}`}>
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked IPs + Geographic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocked IPs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Blocked IPs
              <span className="ml-2 text-sm font-normal text-gray-500">({blockedIPs.length})</span>
            </h2>
            <button
              onClick={() => setShowBlockForm((v) => !v)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Block IP
            </button>
          </div>

          {showBlockForm && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
              <input
                type="text"
                placeholder="IP address (e.g. 192.168.1.1)"
                value={blockIPInput}
                onChange={(e) => setBlockIPInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Reason (optional)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBlockIP}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  Block
                </button>
                <button
                  onClick={() => setShowBlockForm(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {blockedIPs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No IPs currently blocked</p>
            ) : (
              blockedIPs.map((block) => (
                <div key={block.ip} className="p-3 bg-red-50 rounded-lg flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono font-medium text-gray-900 text-sm">{block.ip}</p>
                    <p className="text-xs text-gray-500">{block.reason}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(block.blockedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    onClick={() => unblockIP(block.ip)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Unblock"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Geographic + Auth Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Authentication Statistics</h2>
          <div className="space-y-4 mb-6">
            {[
              { label: 'Successful Logins', value: successfulLogins, color: 'bg-green-500', max: Math.max(successfulLogins + failedLogins, 1) },
              { label: 'Failed Logins', value: failedLogins, color: 'bg-red-500', max: Math.max(successfulLogins + failedLogins, 1) },
              { label: 'OTP Passed', value: mfaSuccesses, color: 'bg-blue-500', max: Math.max(mfaSuccesses + mfaFailures, 1) },
              { label: 'OTP Failed', value: mfaFailures, color: 'bg-orange-500', max: Math.max(mfaSuccesses + mfaFailures, 1) },
            ].map(({ label, value, color, max }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-900 font-bold">{value}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${Math.round((value / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            Geographic Access
          </h3>
          <div className="space-y-2">
            {[
              { country: 'Nigeria', pct: 93.6 },
              { country: 'Ghana', pct: 3.5 },
              { country: 'United Kingdom', pct: 1.8 },
              { country: 'United States', pct: 1.1 },
            ].map(({ country, pct }) => (
              <div key={country} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{country}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
