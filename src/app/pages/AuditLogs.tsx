import { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Shield,
  User,
  Vote,
  LogIn,
  Eye,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  category: 'auth' | 'vote' | 'admin' | 'security';
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    user: 'John Doe (AOPE/2021/001)',
    action: 'Vote Cast',
    category: 'vote',
    timestamp: '2026-06-05 14:32:15',
    ipAddress: '192.168.1.100',
    device: 'Chrome 125 / Windows 11',
    status: 'success',
    details: 'Vote successfully encrypted and recorded'
  },
  {
    id: '2',
    user: 'Jane Smith (AOPE/2021/045)',
    action: 'Facial Verification',
    category: 'auth',
    timestamp: '2026-06-05 14:30:42',
    ipAddress: '192.168.1.101',
    device: 'Safari 17 / iOS 17',
    status: 'success',
    details: 'Biometric verification successful'
  },
  {
    id: '3',
    user: 'Michael Johnson (AOPE/2021/078)',
    action: 'OTP Verification',
    category: 'auth',
    timestamp: '2026-06-05 14:28:33',
    ipAddress: '192.168.1.102',
    device: 'Firefox 126 / macOS',
    status: 'success',
    details: 'OTP verified via email'
  },
  {
    id: '4',
    user: 'Dr. Sarah Johnson (AOPE/STAFF/001)',
    action: 'Candidate Approved',
    category: 'admin',
    timestamp: '2026-06-05 14:25:18',
    ipAddress: '192.168.1.50',
    device: 'Edge 125 / Windows 11',
    status: 'success',
    details: 'Approved candidate: Ibrahim Yusuf for Secretary General'
  },
  {
    id: '5',
    user: 'Anonymous User',
    action: 'Failed Login Attempt',
    category: 'security',
    timestamp: '2026-06-05 14:22:05',
    ipAddress: '203.45.67.89',
    device: 'Unknown',
    status: 'error',
    details: 'Multiple failed login attempts detected'
  },
  {
    id: '6',
    user: 'Admin User (AOPE/ADMIN/001)',
    action: 'Election Settings Updated',
    category: 'admin',
    timestamp: '2026-06-05 14:20:00',
    ipAddress: '192.168.1.10',
    device: 'Chrome 125 / Linux',
    status: 'success',
    details: 'Updated election end time'
  },
  {
    id: '7',
    user: 'Emmanuel Okon (AOPE/2021/123)',
    action: 'Device Verification',
    category: 'security',
    timestamp: '2026-06-05 14:18:45',
    ipAddress: '192.168.1.103',
    device: 'Chrome 125 / Android 14',
    status: 'warning',
    details: 'New device detected - verification required'
  },
  {
    id: '8',
    user: 'Grace Williams (AOPE/2021/156)',
    action: 'Vote Cast',
    category: 'vote',
    timestamp: '2026-06-05 14:15:30',
    ipAddress: '192.168.1.104',
    device: 'Safari 17 / macOS',
    status: 'success',
    details: 'Vote successfully encrypted and recorded'
  },
];

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryIcons: Record<string, React.ElementType> = {
    auth: LogIn,
    vote: Vote,
    admin: Shield,
    security: AlertTriangle
  };

  const statusColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
        <p className="text-gray-600">Comprehensive trail of all system activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Events" value="2,456" color="blue" />
        <StatCard label="Auth Events" value="1,234" color="green" />
        <StatCard label="Votes Logged" value="987" color="purple" />
        <StatCard label="Security Alerts" value="15" color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="vote">Voting</option>
              <option value="admin">Administration</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Action</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Timestamp</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const Icon = categoryIcons[log.category];
                return (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className={`w-10 h-10 rounded-full ${
                        log.category === 'auth' ? 'bg-blue-100' :
                        log.category === 'vote' ? 'bg-green-100' :
                        log.category === 'admin' ? 'bg-purple-100' :
                        'bg-yellow-100'
                      } flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${
                          log.category === 'auth' ? 'text-blue-600' :
                          log.category === 'vote' ? 'text-green-600' :
                          log.category === 'admin' ? 'text-purple-600' :
                          'text-yellow-600'
                        }`} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.user}</p>
                        <p className="text-xs text-gray-500">{log.ipAddress}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.details}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{log.timestamp}</p>
                        <p className="text-xs text-gray-500">{log.device}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredLogs.length}</span> of{' '}
            <span className="font-medium">{mockAuditLogs.length}</span> logs
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Immutable Audit Trail</p>
            <p className="text-sm text-blue-800">
              All logs are cryptographically signed and tamper-proof. Each entry is timestamped and permanently recorded for election transparency and security compliance.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'red';
}

function StatCard({ label, value, color }: StatCardProps) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    red: 'border-red-200 bg-red-50',
  };

  const textColors = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
    red: 'text-red-900',
  };

  return (
    <div className={`border-l-4 ${colors[color]} p-4 rounded-lg`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
    </div>
  );
}
