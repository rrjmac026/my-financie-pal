import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-ocean items-center justify-center p-12">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold font-display text-primary-foreground mb-4">
            💰 BudgetTracker
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Take control of your finances. Track expenses, manage debts, and reach your savings goals.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-primary-foreground/70 text-sm">
            <div className="p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl mb-1">📊</div>
              <div>Smart Reports</div>
            </div>
            <div className="p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl mb-1">💸</div>
              <div>Debt Tracking</div>
            </div>
            <div className="p-3 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <div className="text-2xl mb-1">🎯</div>
              <div>Savings Goals</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="lg:hidden text-3xl mb-2">💰</div>
            <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
                <strong>Demo:</strong> Use any email to login. Use "admin@demo.com" for admin access.
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
