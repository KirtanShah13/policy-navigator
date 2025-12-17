import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo: Accept specific test accounts
    const validAccounts = [
      { email: 'admin@company.com', role: 'admin' },
      { email: 'hr@company.com', role: 'hr' },
      { email: 'employee@company.com', role: 'employee' },
    ];

    const account = validAccounts.find((a) => a.email === email.toLowerCase());

    if (account && password.length >= 6) {
      // Store demo session
      localStorage.setItem('policyrag_user', JSON.stringify({
        id: crypto.randomUUID(),
        email: account.email,
        name: account.email.split('@')[0].charAt(0).toUpperCase() + account.email.split('@')[0].slice(1),
        role: account.role,
      }));
      navigate('/chat');
    } else {
      setError('Invalid credentials. Use admin@company.com, hr@company.com, or employee@company.com with any 6+ character password.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
            <Shield className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">PolicyRAG</h1>
          <p className="text-sm text-muted-foreground mt-1">Enterprise Policy Assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign in to your account</CardTitle>
            <CardDescription>
              Access is restricted to authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Contact your administrator if you need access or have forgotten your credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Protected by enterprise security policies
        </p>
      </div>
    </div>
  );
}
