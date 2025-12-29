import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { User } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Database, Shield, Mail } from 'lucide-react';

export default function AdminSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState({
    allowedDomains: 'company.com',
    requireEmailVerification: true,
    enableSSOLogin: false,
    autoIndexNewPolicies: true,
  });

  /* ---------------- AUTH / ROLE GUARD ---------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');

    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const parsed: User = JSON.parse(storedUser);

    if (parsed.role !== 'admin') {
      navigate('/chat');
      return;
    }

    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  /* ---------------- ACTIONS ---------------- */

  const handleReindexAll = () => {
    toast({
      title: 'Re-indexing all policies',
      description: 'This process may take several minutes to complete.',
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  if (!user) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border bg-background">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure system settings and preferences
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-6">
            {/* Access Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Access Control</CardTitle>
                </div>
                <CardDescription>
                  Configure who can access the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">
                    Allowed Email Domains
                  </Label>
                  <Input
                    id="allowed-domains"
                    value={settings.allowedDomains}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        allowedDomains: e.target.value,
                      })
                    }
                    placeholder="company.com, subsidiary.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of domains allowed to register.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-xs text-muted-foreground">
                      Users must verify their email before access
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        requireEmailVerification: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SSO Login</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow corporate SSO authentication
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableSSOLogin}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        enableSSOLogin: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Policy Index */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Policy Index</CardTitle>
                </div>
                <CardDescription>
                  Manage the policy search index
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Index New Policies</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically index policies when uploaded
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoIndexNewPolicies}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        autoIndexNewPolicies: checked,
                      })
                    }
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <Button variant="outline" onClick={handleReindexAll}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-index All Policies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Email notification settings will be available once backend is connected.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
