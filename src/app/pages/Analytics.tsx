import { Layout } from '../components/Layout';
import { useVotingStore } from '../store/votingStore';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Vote, Target, Download, RefreshCw } from 'lucide-react';

export function Analytics() {
  const { elections, candidates } = useVotingStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeElection = elections.find(e => e.status === 'active');
  const turnoutPercentage = activeElection
    ? ((activeElection.votescast / activeElection.totalVoters) * 100).toFixed(1)
    : 0;

  // Prepare data for charts
  const candidateVoteData = candidates
    .filter(c => c.voteCount)
    .map(c => ({
      name: c.name.split(' ')[0],
      votes: c.voteCount,
      position: c.position
    }));

  const positionData = activeElection?.positions.map(position => {
    const positionCandidates = candidates.filter(c => c.position === position);
    const totalVotes = positionCandidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
    return {
      position: position,
      votes: totalVotes
    };
  }) || [];

  const facultyData = [
    { name: 'Engineering', votes: 1250, color: '#3b82f6' },
    { name: 'Science', votes: 980, color: '#10b981' },
    { name: 'Business', votes: 2432, color: '#f59e0b' },
    { name: 'Arts', votes: 1546, color: '#8b5cf6' },
    { name: 'Technology', votes: 1188, color: '#ec4899' },
    { name: 'Health Sciences', votes: 1879, color: '#06b6d4' },
    { name: 'Agriculture', votes: 823, color: '#14b8a6' },
    { name: 'Environmental Sciences', votes: 756, color: '#84cc16' },
    { name: 'Social Sciences', votes: 756, color: '#f97316' },
  ];

  const turnoutData = [
    { time: '08:00', votes: 150 },
    { time: '10:00', votes: 450 },
    { time: '12:00', votes: 1200 },
    { time: '14:00', votes: 2100 },
    { time: '16:00', votes: 2800 },
    { time: 'Current', votes: activeElection?.votescast || 0 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleExportReport = () => {
    setIsRefreshing(true);
    
    // Generate CSV content
    const csvContent = generateCSVReport();
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `election-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const generateCSVReport = () => {
    let csv = 'Election Analytics Report\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Election Summary\n';
    csv += `Title,${activeElection?.title}\n`;
    csv += `Total Voters,${activeElection?.totalVoters}\n`;
    csv += `Votes Cast,${activeElection?.votescast}\n`;
    csv += `Turnout Rate,${turnoutPercentage}%\n\n`;
    
    csv += 'Candidate Results\n';
    csv += 'Rank,Name,Position,Faculty,Department,Votes,Percentage\n';
    
    candidates
      .filter(c => c.voteCount)
      .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
      .forEach((candidate, index) => {
        const positionTotal = candidates
          .filter(c => c.position === candidate.position)
          .reduce((sum, c) => sum + (c.voteCount || 0), 0);
        const percentage = ((candidate.voteCount || 0) / positionTotal * 100).toFixed(1);
        
        csv += `${index + 1},"${candidate.name}","${candidate.position}","${candidate.faculty}","${candidate.department}",${candidate.voteCount},${percentage}%\n`;
      });
    
    csv += '\nPosition Summary\n';
    csv += 'Position,Total Votes\n';
    positionData.forEach(pos => {
      csv += `"${pos.position}",${pos.votes}\n`;
    });
    
    return csv;
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Election Analytics</h1>
            <p className="text-gray-600">Real-time voting statistics and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
        
        {/* Real-time indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">
            Live updates • Last refreshed: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={Users}
          label="Total Voters"
          value={activeElection?.totalVoters.toLocaleString() || '0'}
          change="+5.2%"
          color="blue"
        />
        <MetricCard
          icon={Vote}
          label="Votes Cast"
          value={activeElection?.votescast.toLocaleString() || '0'}
          change="+12.3%"
          color="green"
        />
        <MetricCard
          icon={TrendingUp}
          label="Turnout Rate"
          value={`${turnoutPercentage}%`}
          change="+8.1%"
          color="orange"
        />
        <MetricCard
          icon={Target}
          label="Positions"
          value={activeElection?.positions.length.toString() || '0'}
          change="—"
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Candidate Votes Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Votes by Candidate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidateVoteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faculty Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Votes by Faculty</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={facultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="votes"
              >
                {facultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Turnout Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Voter Turnout Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={turnoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="votes" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Position Votes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Votes by Position</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="position" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Candidate Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Candidate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Faculty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Votes</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {candidates
                .filter(c => c.voteCount)
                .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                .map((candidate, index) => {
                  const positionTotal = candidates
                    .filter(c => c.position === candidate.position)
                    .reduce((sum, c) => sum + (c.voteCount || 0), 0);
                  const percentage = ((candidate.voteCount || 0) / positionTotal * 100).toFixed(1);

                  return (
                    <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900">#{index + 1}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900">{candidate.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{candidate.position}</td>
                      <td className="py-3 px-4 text-gray-600">{candidate.faculty}</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        {candidate.voteCount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function MetricCard({ icon: Icon, label, value, change, color }: MetricCardProps) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-sm text-green-600 font-medium">{change}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}