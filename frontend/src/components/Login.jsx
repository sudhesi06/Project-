import React, { useState } from 'react';
import { 
  GraduationCap, Mail, Lock, User, Eye, EyeOff, 
  Loader2, AlertCircle, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import { authService } from '../services/auth';

export function Login({ onLogin }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');

  // Status States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const resetFormStates = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchView = (newView) => {
    setView(newView);
    resetFormStates();
  };

  // Validations & Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetFormStates();

    // Validations
    if (!loginEmail.trim()) {
      setErrorMsg('Email or Username is required.');
      return;
    }
    if (loginEmail.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Password is required.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.login(loginEmail, loginPassword, rememberMe);
      onLogin(user);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetFormStates();

    // Validations
    if (!signupName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!signupPassword) {
      setErrorMsg('Password is required.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.signup(signupName, signupEmail, signupPassword);
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLogin(user);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    resetFormStates();

    // Validations
    if (!forgotEmail.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setSuccessMsg(res.message);
      setForgotEmail('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* BRAND HEADER */}
        <div className="auth-header">
          <div className="auth-logo">
            <GraduationCap size={28} />
          </div>
          <h2 className="auth-title">AI Study Planner</h2>
          <p className="auth-subtitle">
            {view === 'login' && 'Sign in to access your study schedules'}
            {view === 'signup' && 'Create your account to get started'}
            {view === 'forgot' && 'Reset your account password'}
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {errorMsg && (
          <div className="auth-error-alert" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-success-alert" style={{ marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN VIEW */}
        {view === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email or Username</label>
              <div className="input-container">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="login-email"
                  type="text"
                  placeholder="name@university.edu"
                  className="form-input input-with-icon"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-container">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input input-with-icon"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>
              
              <span 
                className="auth-link" 
                onClick={() => handleSwitchView('forgot')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSwitchView('forgot')}
              >
                Forgot password?
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <p className="auth-footer-text">
              Don't have an account?{' '}
              <span 
                className="auth-link" 
                onClick={() => handleSwitchView('signup')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSwitchView('signup')}
              >
                Sign up
              </span>
            </p>
          </form>
        )}

        {/* 2. SIGNUP VIEW */}
        {view === 'signup' && (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-container">
                <User className="input-icon-left" size={18} />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  className="form-input input-with-icon"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@university.edu"
                  className="form-input input-with-icon"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-container">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="signup-password"
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className="form-input input-with-icon"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  aria-label={showSignupPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="input-container">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="signup-confirm-password"
                  type={showSignupConfirmPassword ? "text" : "password"}
                  placeholder="Verify password"
                  className="form-input input-with-icon"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                  aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showSignupConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>

            <p className="auth-footer-text">
              Already have an account?{' '}
              <span 
                className="auth-link" 
                onClick={() => handleSwitchView('login')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSwitchView('login')}
              >
                Sign in
              </span>
            </p>
          </form>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {view === 'forgot' && (
          <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="name@university.edu"
                  className="form-input input-with-icon"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                We'll email you a link to reset your password.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <span 
                className="auth-link" 
                onClick={() => handleSwitchView('login')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSwitchView('login')}
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
