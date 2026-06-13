import React, { useState } from 'react';
import { RideProvider, useRide } from './hooks/RideContext';
import { RiderDashboard } from './components/RiderDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { MapContainer } from './components/MapContainer';
import { Car, Lock, User, Eye, EyeOff, Play, ShieldAlert, LogOut, Split, Compass } from 'lucide-react';


const MainAppContent: React.FC = () => {
  const {
    role,
    setRole,
    trip,
    isSimulating,
    simulateMovement,
  } = useRide();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Mock validation matching requirement specifications
    setTimeout(() => {
      if (email === 'intern@namlotech.com' && password === 'namlo2026') {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Invalid testing credentials. Please check input details.');
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // 1. Render Login Interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Namlo Rides Sim
            </h1>
            <p className="text-xs text-slate-400 text-center">
              Real-Time Ride-Sharing Simulation Platform
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Username / Email
              </label>
              <input
                type="email"
                required
                placeholder="intern@namlotech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-sm rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 active:from-blue-700 active:to-emerald-700 text-white transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Verifying Account...' : 'Sign In'}
            </button>
          </form>

          {/* Quick autofill helper for evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Autofill Testing Access
            </div>
            <button
              onClick={() => {
                setEmail('intern@namlotech.com');
                setPassword('namlo2026');
              }}
              className="w-full p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left text-xs text-slate-400 flex items-center justify-between"
            >
              <div>
                <div>User: <code className="text-blue-400 font-mono">intern@namlotech.com</code></div>
                <div>Pass: <code className="text-emerald-400 font-mono">namlo2026</code></div>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Main Platform Interface
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Platform Header */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 px-6 py-3.5 backdrop-blur-md sticky top-0 z-[1000] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-100 tracking-tight">Namlo Rides</span>
        </div>

        {/* Viewport Toggles (Split Screen, Rider Only, Driver Only) */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
          <button
            onClick={() => setRole('SPLIT_SCREEN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'SPLIT_SCREEN'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            Split Screen
          </button>
          <button
            onClick={() => setRole('RIDER')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'RIDER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Rider View
          </button>
          <button
            onClick={() => setRole('DRIVER')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'DRIVER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Driver View
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-rose-400 font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </header>

      {/* Main Workspace Panels Layout */}
      <main className="flex-1 flex p-4 gap-4 overflow-hidden min-h-0 bg-slate-950/20">
        
        {/* LEFT COLUMN: Rider Dashboard */}
        {(role === 'RIDER' || role === 'SPLIT_SCREEN') && (
          <div className="w-full max-w-sm glass-panel p-4 rounded-2xl flex flex-col shrink-0 overflow-y-auto">
            <RiderDashboard />
          </div>
        )}

        {/* CENTER COLUMN: Kathmandu Map & Simulation Telemetry Overlay */}
        <div className="flex-1 flex flex-col gap-4 relative min-h-[400px]">
          <div className="flex-1 relative">
            <MapContainer />
          </div>

          {/* Simulated Telemetry / Animate Driving overlay */}
          {trip && (trip.status === 'ACCEPTED' || trip.status === 'IN_PROGRESS') && (
            <div className="absolute bottom-4 left-4 z-[500] p-4 rounded-xl bg-slate-900/90 text-slate-100 border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-sm w-[calc(100%-2rem)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 animate-pulse">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-300">
                  {trip.status === 'ACCEPTED' ? 'Heading to pickup point' : 'Transit to destination'}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {trip.status === 'ACCEPTED' ? trip.pickup?.address : trip.dropoff?.address}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    Steps: {trip.route.length}
                  </span>
                  {isSimulating && (
                    <span className="text-[9px] text-blue-400 animate-pulse font-semibold">
                      Driving...
                    </span>
                  )}
                </div>
              </div>

              {/* Animate trigger */}
              <button
                onClick={simulateMovement}
                disabled={isSimulating}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isSimulating
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow shadow-blue-500/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Animate
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Driver Dashboard */}
        {(role === 'DRIVER' || role === 'SPLIT_SCREEN') && (
          <div className="w-full max-w-sm glass-panel p-4 rounded-2xl flex flex-col shrink-0 overflow-y-auto">
            <DriverDashboard />
          </div>
        )}
      </main>
    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function App() {
  return (
    <RideProvider>
      <MainAppContent />
    </RideProvider>
  );
}
