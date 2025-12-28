import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Terms & Conditions</h1>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold mb-2">1. Purpose</h2>
          <p>
            PolicyRAG is an internal enterprise assistant designed to help
            employees understand organizational policies. It does not replace
            official documentation or HR guidance.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">2. Accuracy Disclaimer</h2>
          <p>
            Responses are generated based on available policy documents and may
            be incomplete or context-dependent. Always verify critical decisions
            with official sources.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">3. Data Usage</h2>
          <p>
            Chat data is stored locally in your browser for usability purposes.
            No chat data is transmitted externally in this demo environment.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">4. Acceptable Use</h2>
          <p>
            Users must not misuse this system for unlawful, harmful, or
            unauthorized purposes.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">5. Limitation of Liability</h2>
          <p>
            The organization is not liable for actions taken solely based on AI
            responses without verification.
          </p>
        </section>

        <section className="text-xs text-muted-foreground pt-6">
          Last updated: {new Date().toLocaleDateString()}
        </section>
      </main>
    </div>
  );
}
