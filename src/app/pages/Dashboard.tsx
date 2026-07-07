import { useAuthStore } from '../store/authStore';
import { useVotingStore } from '../store/votingStore';
import { Layout } from '../components/Layout';
import {
  Vote,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export function Dashboard() {
  const { user } = useAuthStore();
  const { elections, candidates } = useVotingStore();
  const navigate = useNavigate();

  // Admin: registered students
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');

  const fetchStudents = async () => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const result = await api.getStudents();
      setStudents(result.users || []);
    } catch (err: any) {
      setStudentsError(err.message || 'Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchStudents();
  }, [user?.role]);

  if (!user) {
    navigate('/');
    return null;
  }

  const activeElection = elections.find(e => e.status === 'active');
  const turnoutPercentage = activeElection
    ? ((activeElection.votescast / activeElection.totalVoters) * 100).toFixed(1)
    : 0;

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.fullName}
        </h1>
        <p className="text-gray-600">
          {user.role === 'student' && "You're all set to participate in the election"}
          {user.role === 'electoral_officer' && "Monitor and manage elections"}
          {user.role === 'admin' && "Oversee the entire voting platform"}
        </p>
      </div>

      {/* Role-Specific Stats */}
      {user.role === 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Vote}
            label="Your Voting Status"
            value="Not Voted"
            color="blue"
            action={() => navigate('/vote')}
          />
          <StatCard
            icon={Shield}
            label="Security Status"
            value="Verified"
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Time Remaining"
            value="8h 45m"
            color="orange"
          />
          <StatCard
            icon={Users}
            label="Total Candidates"
            value={candidates.length.toString()}
            color="purple"
          />
        </div>
      )}

      {(user.role === 'electoral_officer' || user.role === 'admin') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Registered Voters"
            value={activeElection?.totalVoters.toLocaleString() || '0'}
            color="blue"
          />
          <StatCard
            icon={Vote}
            label="Votes Cast"
            value={activeElection?.votescast.toLocaleString() || '0'}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Voter Turnout"
            value={`${turnoutPercentage}%`}
            color="orange"
          />
          <StatCard
            icon={BarChart3}
            label="Active Positions"
            value={activeElection?.positions.length.toString() || '0'}
            color="purple"
          />
        </div>
      )}

      {/* Active Election */}
      {activeElection && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{activeElection.title}</h2>
              <p className="text-gray-600">{activeElection.description}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Starts</p>
              <p className="font-medium text-gray-900">
                {new Date(activeElection.startDate).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ends</p>
              <p className="font-medium text-gray-900">
                {new Date(activeElection.endDate).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Positions</p>
              <p className="font-medium text-gray-900">{activeElection.positions.length} roles</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Voting Progress</span>
              <span className="font-medium text-gray-900">{turnoutPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${turnoutPercentage}%` }}
              ></div>
            </div>
          </div>

          {user.role === 'student' && (
            <button
              onClick={() => navigate('/vote')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Cast Your Vote Now
            </button>
          )}
        </div>
      )}

      {/* Admin: Registered Students */}
      {user.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Registered Students</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {students.length}
              </span>
            </div>
            <button
              onClick={fetchStudents}
              disabled={studentsLoading}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${studentsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {studentsError && (
            <p className="text-sm text-red-600 mb-4">{studentsError}</p>
          )}

          {studentsLoading && students.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No students registered yet. Students can register from the login page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Matric No.</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Full Name</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600 hidden sm:table-cell">Faculty</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600 hidden md:table-cell">Department</th>
                    <th className="text-left py-2 font-semibold text-gray-600 hidden lg:table-cell">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 font-mono text-xs text-gray-800">{s.matricNumber}</td>
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{s.fullName}</td>
                      <td className="py-2.5 pr-4 text-gray-600 hidden sm:table-cell">{s.faculty || '—'}</td>
                      <td className="py-2.5 pr-4 text-gray-600 hidden md:table-cell">{s.department || '—'}</td>
                      <td className="py-2.5 text-gray-500 hidden lg:table-cell">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              icon={CheckCircle}
              text="Facial verification completed successfully"
              time="Just now"
              color="green"
            />
            <ActivityItem
              icon={Shield}
              text="OTP verification successful"
              time="2 minutes ago"
              color="blue"
            />
            <ActivityItem
              icon={Users}
              text="Election day started"
              time="8 hours ago"
              color="purple"
            />
            <ActivityItem
              icon={Vote}
              text="New candidates registered"
              time="Yesterday"
              color="orange"
            />
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Security Status</h3>
          <div className="space-y-4">
            <SecurityItem
              label="Multi-Factor Authentication"
              status="Active"
              icon={Shield}
              verified
            />
            <SecurityItem
              label="Facial Recognition"
              status="Verified"
              icon={CheckCircle}
              verified
            />
            <SecurityItem
              label="Device Registration"
              status="Registered"
              icon={CheckCircle}
              verified
            />
            <SecurityItem
              label="Session Security"
              status="Secure"
              icon={Shield}
              verified
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  action?: () => void;
}

function StatCard({ icon: Icon, label, value, color, action }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${action ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={action}
    >
      <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  text: string;
  time: string;
  color: string;
}

function ActivityItem({ icon: Icon, text, time, color }: ActivityItemProps) {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${colors[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{text}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

interface SecurityItemProps {
  label: string;
  status: string;
  icon: React.ElementType;
  verified: boolean;
}

function SecurityItem({ label, status, icon: Icon, verified }: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${verified ? 'text-green-600' : 'text-gray-400'}`} />
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-600">{status}</p>
        </div>
      </div>
      {verified && (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Verified
        </span>
      )}
    </div>
  );
}
