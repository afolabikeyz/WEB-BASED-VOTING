import { create } from 'zustand';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  faculty: string;
  department: string;
  imageUrl: string;
  manifesto: string;
  voteCount?: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'closed';
  positions: string[];
  totalVoters: number;
  votescast: number;
}

export interface Vote {
  id: string;
  electionId: string;
  position: string;
  candidateId: string;
  timestamp: string;
  verified: boolean;
}

interface VotingState {
  elections: Election[];
  candidates: Candidate[];
  userVotes: Vote[];
  currentElection: Election | null;
  hasVoted: boolean;
  castVote: (electionId: string, position: string, candidateId: string) => Promise<boolean>;
  checkVotingStatus: (electionId: string) => boolean;
  setCurrentElection: (election: Election) => void;
  addPosition: (electionId: string, position: string) => void;
  removePosition: (electionId: string, position: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount'>) => void;
  removeCandidate: (candidateId: string) => void;
}

const mockElections: Election[] = [
  {
    id: '1',
    title: 'Student Union Government Election 2026',
    description: 'Annual election for SUG executive positions',
    startDate: '2026-06-10T08:00:00',
    endDate: '2026-06-10T18:00:00',
    status: 'active',
    positions: [
      'President',
      'Vice President',
      'Secretary General',
      'Financial Secretary',
      'Treasurer',
      'Public Relations Officer',
      'Director of Sports',
      'Director of Socials',
      'Welfare Officer',
      'Library Representative'
    ],
    totalVoters: 5000,
    votescast: 3567,
  },
];

const mockCandidates: Candidate[] = [
  // President
  {
    id: '1',
    name: 'Adebayo Olanrewaju',
    position: 'President',
    faculty: 'Engineering',
    department: 'Computer Science',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    manifesto: 'Building a better future for all students through technology and innovation.',
    voteCount: 1250,
  },
  {
    id: '2',
    name: 'Fatima Mohammed',
    position: 'President',
    faculty: 'Science',
    department: 'Biochemistry',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    manifesto: 'Empowering students through quality education and equal opportunities.',
    voteCount: 980,
  },
  {
    id: '3',
    name: 'Oluwaseyi Adeleke',
    position: 'President',
    faculty: 'Environmental Sciences',
    department: 'Estate Management',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    manifesto: 'Sustainable development and environmental consciousness for our institution.',
    voteCount: 756,
  },
  // Vice President
  {
    id: '4',
    name: 'Chukwuemeka Okafor',
    position: 'Vice President',
    faculty: 'Business',
    department: 'Accounting',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    manifesto: 'Fiscal responsibility and transparent student governance.',
    voteCount: 1100,
  },
  {
    id: '5',
    name: 'Blessing Adeyemi',
    position: 'Vice President',
    faculty: 'Arts',
    department: 'Mass Communication',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    manifesto: 'Amplifying student voices and fostering unity across all faculties.',
    voteCount: 890,
  },
  {
    id: '6',
    name: 'Tunde Bakare',
    position: 'Vice President',
    faculty: 'Technology',
    department: 'Information Technology',
    imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    manifesto: 'Technological advancement and digital transformation of student services.',
    voteCount: 654,
  },
  // Secretary General
  {
    id: '7',
    name: 'Ibrahim Yusuf',
    position: 'Secretary General',
    faculty: 'Engineering',
    department: 'Electrical Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    manifesto: 'Efficient administration and transparent record keeping.',
    voteCount: 1050,
  },
  {
    id: '8',
    name: 'Aisha Bello',
    position: 'Secretary General',
    faculty: 'Agriculture',
    department: 'Agricultural Extension',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    manifesto: 'Organized documentation and effective communication systems.',
    voteCount: 823,
  },
  // Financial Secretary
  {
    id: '9',
    name: 'Grace Oluwaseun',
    position: 'Financial Secretary',
    faculty: 'Business',
    department: 'Business Administration',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    manifesto: 'Financial transparency and accountability in student funds.',
    voteCount: 975,
  },
  {
    id: '10',
    name: 'Michael Okonkwo',
    position: 'Financial Secretary',
    faculty: 'Business',
    department: 'Finance',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    manifesto: 'Strategic financial planning and resource management.',
    voteCount: 712,
  },
  // Treasurer
  {
    id: '11',
    name: 'Chidinma Nwosu',
    position: 'Treasurer',
    faculty: 'Business',
    department: 'Banking and Finance',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    manifesto: 'Prudent financial management and investment in student welfare.',
    voteCount: 892,
  },
  {
    id: '12',
    name: 'Abdullahi Musa',
    position: 'Treasurer',
    faculty: 'Business',
    department: 'Accounting',
    imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    manifesto: 'Sound fiscal policies and budget optimization.',
    voteCount: 745,
  },
  // Public Relations Officer
  {
    id: '13',
    name: 'Ngozi Obi',
    position: 'Public Relations Officer',
    faculty: 'Arts',
    department: 'Mass Communication',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    manifesto: 'Effective communication and positive public image.',
    voteCount: 1025,
  },
  {
    id: '14',
    name: 'Samuel Adekunle',
    position: 'Public Relations Officer',
    faculty: 'Arts',
    department: 'Public Relations',
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
    manifesto: 'Building bridges between students and administration.',
    voteCount: 687,
  },
  // Director of Sports
  {
    id: '15',
    name: 'Emeka Okonkwo',
    position: 'Director of Sports',
    faculty: 'Health Sciences',
    department: 'Physical & Health Education',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
    manifesto: 'Promoting sports excellence and physical wellness.',
    voteCount: 956,
  },
  {
    id: '16',
    name: 'Victoria Chukwu',
    position: 'Director of Sports',
    faculty: 'Science',
    department: 'Sports Science',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    manifesto: 'Inclusive sports programs and inter-faculty competitions.',
    voteCount: 678,
  },
  // Director of Socials
  {
    id: '17',
    name: 'Oluwafemi Ajayi',
    position: 'Director of Socials',
    faculty: 'Arts',
    department: 'Theatre Arts',
    imageUrl: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=400',
    manifesto: 'Vibrant social events and cultural celebrations.',
    voteCount: 834,
  },
  {
    id: '18',
    name: 'Aminat Lawal',
    position: 'Director of Socials',
    faculty: 'Arts',
    department: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    manifesto: 'Creative events that bring students together.',
    voteCount: 712,
  },
  // Welfare Officer
  {
    id: '19',
    name: 'David Adeleke',
    position: 'Welfare Officer',
    faculty: 'Health Sciences',
    department: 'Nursing',
    imageUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400',
    manifesto: 'Student well-being and quality campus life.',
    voteCount: 923,
  },
  {
    id: '20',
    name: 'Zainab Ibrahim',
    position: 'Welfare Officer',
    faculty: 'Social Sciences',
    department: 'Social Work',
    imageUrl: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400',
    manifesto: 'Comprehensive welfare programs and student support.',
    voteCount: 756,
  },
  // Library Representative
  {
    id: '21',
    name: 'Precious Okoro',
    position: 'Library Representative',
    faculty: 'Science',
    department: 'Library Science',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    manifesto: 'Enhanced library services and digital resources.',
    voteCount: 645,
  },
  {
    id: '22',
    name: 'Yusuf Aliyu',
    position: 'Library Representative',
    faculty: 'Technology',
    department: 'Information Technology',
    imageUrl: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=400',
    manifesto: 'Modern library technology and extended access hours.',
    voteCount: 534,
  },
];

export const useVotingStore = create<VotingState>((set, get) => ({
  elections: mockElections,
  candidates: mockCandidates,
  userVotes: [],
  currentElection: null,
  hasVoted: false,

  castVote: async (electionId: string, position: string, candidateId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newVote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      electionId,
      position,
      candidateId,
      timestamp: new Date().toISOString(),
      verified: true,
    };

    set(state => ({
      userVotes: [...state.userVotes, newVote],
      candidates: state.candidates.map(c =>
        c.id === candidateId
          ? { ...c, voteCount: (c.voteCount || 0) + 1 }
          : c
      ),
      elections: state.elections.map(e =>
        e.id === electionId
          ? { ...e, votescast: e.votescast + 1 }
          : e
      ),
    }));

    return true;
  },

  checkVotingStatus: (electionId: string) => {
    const { userVotes } = get();
    return userVotes.some(vote => vote.electionId === electionId);
  },

  setCurrentElection: (election: Election) => {
    set({ currentElection: election });
  },

  addPosition: (electionId: string, position: string) => {
    set(state => ({
      elections: state.elections.map(e =>
        e.id === electionId
          ? { ...e, positions: [...e.positions, position] }
          : e
      ),
    }));
  },

  removePosition: (electionId: string, position: string) => {
    set(state => ({
      elections: state.elections.map(e =>
        e.id === electionId
          ? { ...e, positions: e.positions.filter(p => p !== position) }
          : e
      ),
    }));
  },

  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount'>) => {
    set(state => ({
      candidates: [
        ...state.candidates,
        { ...candidate, id: Math.random().toString(36).substr(2, 9) },
      ],
    }));
  },

  removeCandidate: (candidateId: string) => {
    set(state => ({
      candidates: state.candidates.filter(c => c.id !== candidateId),
    }));
  },
}));