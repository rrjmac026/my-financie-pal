import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: 'Reset link sent', description: `Check your email at ${email}` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="text-3xl mb-2">🔐</div>
          <CardTitle className="text-2xl font-display">Reset Password</CardTitle>
          <CardDescription>
            {sent ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full">Send Reset Link</Button>
              <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex-col gap-3">
            <p className="text-sm text-muted-foreground text-center">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Button variant="outline" onClick={() => setSent(false)} className="w-full">Send again</Button>
            <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
