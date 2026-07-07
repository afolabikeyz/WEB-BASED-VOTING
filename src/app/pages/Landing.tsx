import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Shield, Vote, Users, BarChart3, Lock, Eye,
  CheckCircle, ArrowRight, Smartphone, Globe,
  Award, ChevronDown, GraduationCap
} from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: '3-Stage Authentication',
    desc: 'Password login, OTP verification, and facial recognition ensure only eligible students vote.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Vote,
    title: 'One Person, One Vote',
    desc: 'Cryptographic controls prevent duplicate voting across all 10 executive positions.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Results',
    desc: 'Live vote tallying and analytics dashboards give instant, transparent election insights.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Eye,
    title: 'Full Audit Trail',
    desc: 'Every action is timestamped and logged for post-election review and accountability.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    desc: 'Fully responsive — students vote from any device, anywhere on campus.',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: Globe,
    title: 'End-to-End Encryption',
    desc: 'All data is encrypted in transit and at rest, meeting government-grade security standards.',
    color: 'bg-rose-100 text-rose-600',
  },
];

const positions = [
  'President', 'Vice President', 'Secretary General',
  'Financial Secretary', 'Treasurer', 'PRO',
  'Director of Sports', 'Director of Socials', 'Welfare Officer', 'Library Rep',
];

const steps = [
  { step: '01', title: 'Register', desc: 'Create your voter account using your matric number, faculty, and a secure password.' },
  { step: '02', title: 'Verify Identity', desc: 'Complete OTP and facial recognition to confirm you are an eligible AOPE student.' },
  { step: '03', title: 'Cast Your Vote', desc: 'Select your preferred candidate for each of the 10 SUG executive positions.' },
  { step: '04', title: 'Track Results', desc: 'Watch live results update in real time as votes are counted securely.' },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-white h-5 w-5" />
            </div>
            <span className="font-bold text-gray-900">AOPE SecureVote</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Register to Vote
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-800/60 border border-blue-600/40 text-blue-200 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Election 2026 — Voting Now Open
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Vote.<br />
              <span className="text-green-400">Your Future.</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              The official secure voting platform for the Adeseun Ogundoyin Polytechnic, Eruwa
              Student Union Government Elections 2026.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-green-900/30"
              >
                Register & Vote Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-4 rounded-xl text-base transition-colors"
              >
                Login to Platform
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-xl mx-auto"
          >
            {[
              { value: '5,000+', label: 'Eligible Voters' },
              { value: '10', label: 'SUG Positions' },
              { value: '100%', label: 'Secure & Verified' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
                <p className="text-xs sm:text-sm text-blue-300 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center">
          <ChevronDown className="h-6 w-6 text-blue-400 animate-bounce" />
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Four simple steps from registration to a counted vote.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative"
              >
                <div className="text-4xl font-black text-blue-100 mb-4">{step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Built for Security. Designed for Students.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every feature is designed to ensure a fair, transparent, and tamper-proof election.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positions ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Election Positions</h2>
            <p className="text-blue-300 max-w-xl mx-auto">
              Vote for your preferred candidate across all 10 SUG executive positions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {positions.map((pos, i) => (
              <motion.div
                key={pos}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-blue-800/50 border border-blue-700/40 rounded-xl p-4 text-center hover:bg-blue-700/50 transition-colors"
              >
                <Award className="h-5 w-5 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">{pos}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security strip ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Government-Grade Security
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                AOPE SecureVote uses the same security principles as national elections — multi-factor
                authentication, biometric verification, and immutable audit logs — scaled for your polytechnic community.
              </p>
              <ul className="space-y-3">
                {[
                  'SHA-256 password hashing',
                  'Time-limited OTP codes (10 minutes)',
                  'Facial recognition identity check',
                  'Full session audit logging',
                  'Encrypted data storage',
                  'Real-time threat monitoring',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'MFA Enforced', sub: '3-stage auth', color: 'bg-blue-600' },
                { icon: Lock, label: 'AES-256', sub: 'Encryption', color: 'bg-green-600' },
                { icon: Eye, label: 'Biometric', sub: 'Face ID verify', color: 'bg-purple-600' },
                { icon: BarChart3, label: 'Live Audit', sub: 'Full trail', color: 'bg-orange-600' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <GraduationCap className="h-12 w-12 mx-auto mb-5 text-blue-200" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Registration is open. The future of your Student Union depends on your vote.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">AOPE SecureVote</span>
          </div>
          <p className="text-xs text-center">
            © 2026 Adeseun Ogundoyin Polytechnic, Eruwa. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Student Union Government Elections 2026
          </div>
        </div>
      </footer>

    </div>
  );
}
