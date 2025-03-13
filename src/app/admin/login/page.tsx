"use client";

import { useState, useEffect } from 'react';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { ref, set, get, getDatabase } from 'firebase/database';
import { auth } from '../../../../firebase';
import { Feather } from 'lucide-react';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const db = getDatabase();

  const getDefaultUsername = (email: string) => {
    return email.split('@')[0];
  };

  const addUserToDatabase = async (user: User) => {
    const userRef = ref(db, `users/${user.uid}`);

    try {
      const snapshot = await get(userRef);
      const existingData = snapshot.val();

      const userData = {
        email: user.email,
        username: existingData?.username || getDefaultUsername(user.email || ''),
        displayName: existingData?.displayName || user.displayName || getDefaultUsername(user.email || ''),
        profilePicture: user.photoURL || existingData?.profilePicture || '',
        admin: existingData?.admin || false,
        ...(existingData ? {} : { createdAt: new Date().toISOString() }),
        ...existingData
      };

      await set(userRef, userData);
    } catch (error) {
      console.error("Error managing user in database: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      addUserToDatabase(result.user);
      setSuccess('Signed in successfully!');
      setError('');
    } catch (error) {
      console.error("Error signing in with Email: ", error);
      setError('Failed to sign in. Please check your email and password.');
    }
  };

  const handleSignUp = async () => {
    if (!validatePasswords()) return;

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username || getDefaultUsername(email) });
      addUserToDatabase(result.user);
      setSuccess('Account created successfully!');
      setError('');
    } catch (error) {
      console.error("Error signing up: ", error);
      setError('Failed to create account. Please try again.');
    }
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSuccess('Signed out successfully!');
      setError('');
    } catch (error) {
      console.error("Error signing out: ", error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setPasswordError('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const renderFloatingLeaves = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          animationName: 'float',
          animationDuration: `${15 + Math.random() * 10}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDelay: `${i * 1.5}s`,
          top: '-24px'
        }}
      >
        <Feather
          size={16 + Math.random() * 16}
          className="text-gold-600/40 animate-spin-slow transform"
        />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative overflow-hidden">
      {/* CSS for Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(-5vh) translateX(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh) translateX(10px); opacity: 0; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-50"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2M4YjA3MCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Floating Leaves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {renderFloatingLeaves()}
      </div>

      {/* Gold Banners */}
      <div className="fixed top-0 right-0 w-full h-16 bg-gradient-to-r from-gold-600/5 via-gold-600/10 to-transparent transform -skew-y-6"></div>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-l from-gold-600/5 via-gold-600/10 to-transparent transform skew-y-6"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gold-600/10">
          <h1 className="text-2xl font-light text-gray-900 text-center mb-6">
            {isSignUp ? 'Create an Account' : 'Welcome Back!'}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gold-600/20 bg-white/50 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg border border-gold-600/20 bg-white/50 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-gold-600/20 bg-white/50 outline-none"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gold-600/20 bg-white/50 outline-none"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            )}

            <button
              onClick={isSignUp ? handleSignUp : handleEmailLogin}
              className="w-full bg-gold-600/10 text-gold-600 px-4 py-2 rounded-lg hover:bg-gold-600/20 transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="text-center text-sm text-gray-600">
              <span>{isSignUp ? 'Already have an account? ' : 'New to the app? '}</span>
              <button
                onClick={toggleAuthMode}
                className="text-gold-600 hover:text-gold-700"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}