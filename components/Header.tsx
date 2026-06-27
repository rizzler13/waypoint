'use client';

import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';

interface HeaderProps {
  showMiddleTitle?: boolean;
}

export default function Header({ showMiddleTitle = false }: HeaderProps) {
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Firebase auth state / inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser: User | null) => {
        if (firebaseUser) {
          const identifier = firebaseUser.displayName || firebaseUser.email || 'User';
          setUser(identifier);
          localStorage.setItem('wp_user', identifier);
        } else {
          setUser(null);
          localStorage.removeItem('wp_user');
        }
      });
      return () => unsubscribe();
    } else {
      const savedUser = localStorage.getItem('wp_user');
      if (savedUser) {
        setUser(savedUser);
      }
    }
  }, []);

  // Sync progress tracker dynamically
  const updateProgress = () => {
    try {
      const saved = localStorage.getItem('wp_completed_chapters');
      if (saved) {
        setCompletedChapters(JSON.parse(saved));
      } else {
        setCompletedChapters([]);
      }
    } catch {
      setCompletedChapters([]);
    }
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener('wp_progress_update', updateProgress);
    window.addEventListener('storage', updateProgress);
    return () => {
      window.removeEventListener('wp_progress_update', updateProgress);
      window.removeEventListener('storage', updateProgress);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setAuthError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { message?: string };
      setAuthError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (!auth) return;
    setAuthError(null);
    setIsLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalLogin = (username: string) => {
    localStorage.setItem('wp_user', username);
    setUser(username);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Sign out error:', error);
      }
    } else {
      localStorage.removeItem('wp_user');
      setUser(null);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 h-14 border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-40 select-none">
        {/* Left: Waypoint Logo */}
        <Logo />

        {/* Center: Walking Path Subtitle */}
        {showMiddleTitle ? (
          <div className="hidden md:block text-center font-sans text-xs font-bold text-slate-500">
            AWS Learning Path — Interactive Architecture Sim
          </div>
        ) : (
          <div></div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* GitHub Link for logged in user */}
              <a
                href="https://github.com/rizzler13/waypoint"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100"
                title="Waypoint Repository on GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
              </a>

              <div className="relative" ref={dropdownRef}>
                {/* User Profile Avatar */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B17FE] hover:brightness-110 text-white font-bold text-sm shadow cursor-pointer focus:outline-none select-none"
                >
                  {user.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-3 z-50 animate-fade-in text-slate-800 font-sans">
                    <div className="px-4 pb-2 border-b border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Profile Account</span>
                      <span className="block text-xs font-bold mt-0.5 truncate text-slate-800">{user}</span>
                    </div>
                    
                    {/* Completed Paths / Tracker */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Completed Paths</span>
                      <div className="space-y-1 mt-1 text-[11px] font-medium text-slate-600">
                        <div className="flex justify-between items-center">
                          <span>1. IAM Fundamentals</span>
                          {completedChapters.includes('iam') ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">&#9675;</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>2. VPC Subnets</span>
                          {completedChapters.includes('vpc') ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">&#9675;</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>3. EC2 Computing</span>
                          {completedChapters.includes('ec2') ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">&#9675;</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>4. S3 Storage</span>
                          {completedChapters.includes('s3') ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">&#9675;</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span>5. CloudFront CDN</span>
                          {completedChapters.includes('cloudfront') ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">&#9675;</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <div className="px-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-[#1B17FE] hover:brightness-110 text-white cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                Sign Up
              </button>

              {/* GitHub Link for non-logged in user */}
              <a
                href="https://github.com/rizzler13/waypoint"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100"
                title="Waypoint Repository on GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
              </a>
            </>
          )}
        </div>
      </header>

      {/* Simulated / Firebase Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl max-w-sm w-full p-6 font-sans text-slate-800 relative overflow-hidden flex flex-col gap-4">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-[#1B17FE]" />
            
            {/* Modal Header */}
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 text-[#1B17FE] rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {isFirebaseConfigured ? (isSignUp ? 'Create Account' : 'Access Waypoint') : 'Access Waypoint'}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isFirebaseConfigured ? 'Save and track your AWS learning achievements.' : 'Enter a username to load your learning achievements.'}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] p-2.5 rounded-xl font-medium leading-relaxed">
                ⚠️ {authError}
              </div>
            )}

            {isFirebaseConfigured ? (
              /* Firebase Auth Flow */
              <div className="flex flex-col gap-4">
                {/* Sign In / Sign Up segmented toggle tab controls */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => { setIsSignUp(false); setAuthError(null); }}
                    disabled={isLoading}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white text-[#1B17FE] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsSignUp(true); setAuthError(null); }}
                    disabled={isLoading}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white text-[#1B17FE] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Google Sign In Option */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2.5 w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">or email</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Email / Password Form */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="auth-email" className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="auth-email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#1B17FE] focus:ring-2 focus:ring-[#1B17FE]/15 transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="auth-password" className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="auth-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#1B17FE] focus:ring-2 focus:ring-[#1B17FE]/15 transition-all text-slate-800"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEmailPasswordLogin();
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => { setShowLoginModal(false); setAuthError(null); }}
                    disabled={isLoading}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailPasswordLogin}
                    disabled={isLoading}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#1B17FE] hover:brightness-110 text-white cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isSignUp ? 'Create' : 'Sign In'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Local Storage Simulation Flow */
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-700 leading-relaxed font-medium">
                  <span className="font-bold block mb-0.5 text-amber-800">ℹ️ Local Demo Mode</span>
                  Waypoint is running locally without Firebase configuration. Add keys to <code className="bg-amber-100/60 px-1 py-0.5 rounded">.env.local</code> to activate real authentication, or type a simulated username below.
                </div>

                <div>
                  <label htmlFor="login-username" className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Choose Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-xs select-none">
                      @
                    </span>
                    <input
                      type="text"
                      defaultValue="rizzler13"
                      id="login-username"
                      placeholder="e.g. rizzler13"
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#1B17FE] focus:ring-2 focus:ring-[#1B17FE]/15 transition-all font-mono text-slate-800"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value || 'rizzler13';
                          handleLocalLogin(val);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const input = document.getElementById('login-username') as HTMLInputElement;
                      handleLocalLogin(input.value || 'rizzler13');
                    }}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#1B17FE] hover:brightness-110 text-white cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-blue-500/10"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
