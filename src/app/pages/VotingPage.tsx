import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useVotingStore, Candidate } from '../store/votingStore';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router';
import {
  Vote,
  Check,
  Shield,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

export function VotingPage() {
  const { user } = useAuthStore();
  const { elections, candidates, castVote, checkVotingStatus } = useVotingStore();
  const navigate = useNavigate();

  const activeElection = elections.find(e => e.status === 'active');
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'select' | 'review' | 'confirm' | 'success'>('select');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  if (!activeElection) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Election</h2>
          <p className="text-gray-600">There are no elections currently open for voting.</p>
        </div>
      </Layout>
    );
  }

  const hasVoted = checkVotingStatus(activeElection.id);

  if (hasVoted && currentStep !== 'success') {
    return (
      <Layout>
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You've Already Voted</h2>
          <p className="text-gray-600 mb-6">Your vote has been recorded successfully.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const handleSelectCandidate = (position: string, candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleReview = () => {
    const allPositionsFilled = activeElection.positions.every(
      pos => selectedCandidates[pos]
    );

    if (!allPositionsFilled) {
      toast.error('Please select a candidate for each position');
      return;
    }

    setCurrentStep('review');
  };

  const handleConfirm = () => {
    setCurrentStep('confirm');
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      for (const [position, candidateId] of Object.entries(selectedCandidates)) {
        await castVote(activeElection.id, position, candidateId);
      }

      setCurrentStep('success');
      toast.success('Your vote has been cast successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          <StepIndicator label="Select" active={currentStep === 'select'} completed={['review', 'confirm', 'success'].includes(currentStep)} />
          <div className="w-12 sm:w-24 h-1 bg-gray-300"></div>
          <StepIndicator label="Review" active={currentStep === 'review'} completed={['confirm', 'success'].includes(currentStep)} />
          <div className="w-12 sm:w-24 h-1 bg-gray-300"></div>
          <StepIndicator label="Confirm" active={currentStep === 'confirm'} completed={currentStep === 'success'} />
        </div>
      </div>

      {/* Success State */}
      {currentStep === 'success' && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vote Cast Successfully!</h2>
          <p className="text-lg text-gray-600 mb-2">Your vote has been securely recorded and encrypted.</p>
          <p className="text-sm text-gray-500 mb-8">Redirecting to dashboard...</p>

          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-bold text-gray-900">Vote Verification</h3>
            </div>
            <div className="space-y-3 text-sm text-left">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Identity verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Vote encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Audit log created</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Confirmation sent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select Candidates */}
      {currentStep === 'select' && (
        <div>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{activeElection.title}</h1>
            <p className="text-gray-600">Select one candidate for each position</p>
          </div>

          <div className="space-y-8">
            {activeElection.positions.map(position => {
              const positionCandidates = candidates.filter(c => c.position === position);
              return (
                <div key={position} className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{position}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {positionCandidates.map(candidate => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        selected={selectedCandidates[position] === candidate.id}
                        onSelect={() => handleSelectCandidate(position, candidate.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleReview}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              Review Selection
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Review Selection */}
      {currentStep === 'review' && (
        <div>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Review Your Selection</h1>
            <p className="text-gray-600">Please review your choices before confirming</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Selected Candidates</h2>
            <div className="space-y-4">
              {Object.entries(selectedCandidates).map(([position, candidateId]) => {
                const candidate = candidates.find(c => c.id === candidateId);
                if (!candidate) return null;
                return (
                  <div key={position} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{position}</p>
                      <p className="font-bold text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-600">{candidate.department}</p>
                    </div>
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Important Notice</p>
                <p className="text-sm text-yellow-800">
                  Once you confirm your vote, it cannot be changed. Please review your selection carefully.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-between">
            <button
              onClick={() => setCurrentStep('select')}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Back to Selection
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              Proceed to Confirm
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Final Confirmation */}
      {currentStep === 'confirm' && (
        <div>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Final Confirmation</h1>
            <p className="text-gray-600">Verify your identity and cast your vote</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <div className="text-center mb-6">
                <Vote className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Cast Your Vote</h2>
                <p className="text-gray-600">Your vote will be encrypted and anonymized</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Voter Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">{user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">{user.matricNumber}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-red-900">
                  By clicking "Cast My Vote", you confirm that:
                </p>
                <ul className="text-sm text-red-800 mt-2 space-y-1">
                  <li>• This is your personal vote and has not been influenced</li>
                  <li>• You understand that this action is final and irreversible</li>
                  <li>• You agree to the election terms and conditions</li>
                </ul>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-lg font-bold text-lg transition-colors"
              >
                {loading ? 'Submitting Your Vote...' : 'Cast My Vote'}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('review')}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to review
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

interface StepIndicatorProps {
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          completed
            ? 'bg-green-600 text-white'
            : active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-600'
        }`}
      >
        {completed ? <Check className="h-5 w-5" /> : ''}
      </div>
      <span className={`text-xs mt-1 ${active ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  selected: boolean;
  onSelect: () => void;
}

function CandidateCard({ candidate, selected, onSelect }: CandidateCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <img
          src={candidate.imageUrl}
          alt={candidate.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{candidate.name}</h3>
          <p className="text-sm text-gray-600">{candidate.faculty}</p>
          <p className="text-xs text-gray-500">{candidate.department}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-3 line-clamp-2">{candidate.manifesto}</p>
    </div>
  );
}
