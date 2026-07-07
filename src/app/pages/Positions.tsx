import { Layout } from '../components/Layout';
import { useVotingStore } from '../store/votingStore';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { Plus, Trash2, Award, Users, Vote, AlertCircle } from 'lucide-react';

export function Positions() {
  const { elections, candidates, addPosition, removePosition } = useVotingStore();
  const { user } = useAuthStore();
  const [newPosition, setNewPosition] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  const activeElection = elections.find(e => e.status === 'active') || elections[0];

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      setError('Position name cannot be empty');
      return;
    }

    if (activeElection.positions.includes(newPosition.trim())) {
      setError('This position already exists');
      return;
    }

    addPosition(activeElection.id, newPosition.trim());
    setNewPosition('');
    setShowAddModal(false);
    setError('');
  };

  const handleRemovePosition = (position: string) => {
    const candidatesInPosition = candidates.filter(c => c.position === position);
    
    if (candidatesInPosition.length > 0) {
      if (!confirm(`This position has ${candidatesInPosition.length} candidate(s). Are you sure you want to remove it?`)) {
        return;
      }
    }

    removePosition(activeElection.id, position);
  };

  // Only admins and electoral officers can access
  if (user?.role !== 'admin' && user?.role !== 'electoral_officer') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Election Positions</h1>
          <p className="text-gray-600">Manage positions for {activeElection.title}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Position</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900">{activeElection.positions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Vote className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Votes Cast</p>
              <p className="text-2xl font-bold text-gray-900">{activeElection.votescast.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Positions</h2>
          <p className="text-sm text-gray-600 mt-1">Click on a position to view candidates</p>
        </div>

        <div className="divide-y divide-gray-200">
          {activeElection.positions.map((position) => {
            const positionCandidates = candidates.filter(c => c.position === position);
            const totalVotes = positionCandidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
            const leadingCandidate = positionCandidates.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))[0];

            return (
              <div key={position} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">{position}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Candidates</p>
                        <p className="text-xl font-bold text-gray-900">{positionCandidates.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Votes</p>
                        <p className="text-xl font-bold text-gray-900">{totalVotes.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Leading</p>
                        <p className="text-sm font-medium text-gray-900">
                          {leadingCandidate ? `${leadingCandidate.name.split(' ')[0]} (${leadingCandidate.voteCount})` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Candidate Breakdown */}
                    {positionCandidates.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Vote Distribution:</p>
                        <div className="space-y-2">
                          {positionCandidates.map((candidate) => {
                            const percentage = totalVotes > 0 ? ((candidate.voteCount || 0) / totalVotes * 100).toFixed(1) : 0;
                            return (
                              <div key={candidate.id}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-700">{candidate.name}</span>
                                  <span className="font-medium text-gray-900">{candidate.voteCount || 0} votes ({percentage}%)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 transition-all"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemovePosition(position)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Position"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {activeElection.positions.length === 0 && (
            <div className="p-12 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Positions Yet</h3>
              <p className="text-gray-600 mb-4">Add your first position to get started</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Position
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Position</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Name
              </label>
              <input
                type="text"
                value={newPosition}
                onChange={(e) => {
                  setNewPosition(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Treasurer, PRO, Director of Sports"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPosition('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPosition}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Position
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
