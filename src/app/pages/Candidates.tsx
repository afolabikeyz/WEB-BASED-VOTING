import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useVotingStore } from '../store/votingStore';
import { useAuthStore } from '../store/authStore';
import { Users, Search, Filter, Award, Plus, X, Trash2, ChevronDown } from 'lucide-react';

const FACULTIES = [
  'Engineering Technology', 'Environmental Studies', 'Business Studies',
  'Science & Technology', 'Agricultural Technology', 'Art, Design & Printing',
  'Administration & Management', 'Liberal Studies', 'Health Technology',
];

const AVATAR_COLORS = [
  'from-blue-500 to-blue-700', 'from-green-500 to-green-700',
  'from-purple-500 to-purple-700', 'from-orange-500 to-orange-700',
  'from-teal-500 to-teal-700', 'from-rose-500 to-rose-700',
  'from-indigo-500 to-indigo-700', 'from-cyan-500 to-cyan-700',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const emptyForm = {
  name: '', position: '', faculty: '', department: '', manifesto: '', imageUrl: '',
};

export function Candidates() {
  const { candidates, elections, addCandidate, removeCandidate } = useVotingStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const canManage = user?.role === 'admin' || user?.role === 'electoral_officer';
  const positions = Array.from(new Set(
    elections.flatMap((e) => e.positions).concat(candidates.map((c) => c.position))
  )).sort();
  const faculties = Array.from(new Set(candidates.map((c) => c.faculty))).sort();

  const filtered = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.position.toLowerCase().includes(q);
    const matchPos = filterPosition === 'all' || c.position === filterPosition;
    const matchFac = filterFaculty === 'all' || c.faculty === filterFaculty;
    return matchSearch && matchPos && matchFac;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.position || !form.faculty) return;
    addCandidate({
      name: form.name.trim(),
      position: form.position,
      faculty: form.faculty,
      department: form.department.trim(),
      manifesto: form.manifesto.trim(),
      imageUrl: form.imageUrl.trim() || '',
    });
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    removeCandidate(id);
    setConfirmDelete(null);
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">All Candidates</h1>
          <p className="text-gray-600">{candidates.length} candidates across {positions.length} positions</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Add Candidate
          </button>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add New Candidate</h2>
              <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Adebayo Olanrewaju"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <div className="relative">
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select a position</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                <div className="relative">
                  <select
                    value={form.faculty}
                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select faculty</option>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manifesto</label>
                <textarea
                  value={form.manifesto}
                  onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
                  placeholder="Candidate's campaign statement..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Candidate
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Candidate?</h3>
            <p className="text-sm text-gray-600 mb-5">This will permanently remove the candidate from the election. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Remove</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Positions</option>
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Card Header */}
            <div className={`relative h-44 bg-gradient-to-br ${avatarColor(candidate.id)} flex items-end`}>
              {candidate.imageUrl ? (
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative p-4 flex items-center gap-3 w-full">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColor(candidate.id)} border-3 border-white flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                  {candidate.imageUrl
                    ? <img src={candidate.imageUrl} alt="" className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : initials(candidate.name)
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{candidate.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-xs rounded-full mt-0.5">{candidate.position}</span>
                </div>
                {canManage && (
                  <button
                    onClick={() => setConfirmDelete(candidate.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-white flex-shrink-0"
                    title="Remove candidate"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  {candidate.faculty}
                </div>
                {candidate.department && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Award className="h-3.5 w-3.5" />
                    {candidate.department}
                  </div>
                )}
              </div>

              {candidate.manifesto && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{candidate.manifesto}</p>
              )}

              {candidate.voteCount !== undefined && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Current Votes</span>
                  <span className="text-base font-bold text-blue-600">{candidate.voteCount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Users className="h-14 w-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No candidates found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm || filterPosition !== 'all' || filterFaculty !== 'all'
              ? 'Try adjusting your search or filters'
              : canManage ? 'Click "Add Candidate" to register the first candidate' : 'No candidates have been registered yet'}
          </p>
        </div>
      )}
    </Layout>
  );
}
