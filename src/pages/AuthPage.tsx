import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, resetPassword, updatePassword } = useAuth();
  
  const initialMode = searchParams.get('mode');
  const [mode, setMode] = useState(
    initialMode === 'signup' ? 'signup' : 
    initialMode === 'reset-password' ? 'reset-password' :
    initialMode === 'update-password' ? 'update-password' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && mode !== 'update-password') {
      navigate('/');
    }
  }, [user, navigate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName);
      } else if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'reset-password') {
        const { error } = await resetPassword(email);
        if (!error) {
          setMessage('Password reset email sent! Check your inbox.');
        }
      } else if (mode === 'update-password') {
        if (password !== confirmPassword) {
          setMessage('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setMessage('Password must be at least 6 characters long');
          return;
        }
        const { error } = await updatePassword(password);
        if (!error) {
          setMessage('Password updated successfully! Redirecting...');
          setTimeout(() => navigate('/'), 2000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCardTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'reset-password': return 'Reset Password';
      case 'update-password': return 'Update Password';
      default: return 'Welcome Back';
    }
  };

  const getCardDescription = () => {
    switch (mode) {
      case 'signup': return 'Sign up to order custom videos or access your dashboard';
      case 'reset-password': return 'Enter your email address and we\'ll send you a password reset link';
      case 'update-password': return 'Enter your new password below';
      default: return 'Sign in to your account';
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'signup': return 'Creating Account...';
        case 'reset-password': return 'Sending Reset Link...';
        case 'update-password': return 'Updating Password...';
        default: return 'Signing In...';
      }
    }
    
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'reset-password': return 'Send Reset Link';
      case 'update-password': return 'Update Password';
      default: return 'Sign In';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-subtle">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">
              {getCardTitle()}
            </CardTitle>
            <CardDescription>
              {getCardDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {(mode === 'signin' || mode === 'signup' || mode === 'reset-password') && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {(mode === 'signin' || mode === 'signup' || mode === 'update-password') && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {mode === 'update-password' ? 'New Password' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              )}

              {mode === 'update-password' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              )}

              {message && (
                <div className={`text-sm text-center p-3 rounded-lg ${
                  message.includes('successfully') || message.includes('sent') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {getSubmitButtonText()}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              {mode === 'signin' && (
                <Button
                  variant="link"
                  onClick={() => setMode('reset-password')}
                  className="text-sm"
                >
                  Forgot your password?
                </Button>
              )}

              {mode === 'reset-password' && (
                <Button
                  variant="link"
                  onClick={() => setMode('signin')}
                  className="flex items-center mx-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              )}

              {(mode === 'signin' || mode === 'signup') && (
                <Button
                  variant="link"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                >
                  {mode === 'signup' 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}