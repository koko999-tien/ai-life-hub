'use client';

import { Bot, Copy, Check, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui';

interface AgentTemplate {
  name: string;
  description: string;
  config: Record<string, unknown>;
}

interface AgentTemplateCardProps {
  agent: AgentTemplate;
  onUseAgent: (agent: AgentTemplate) => void;
}

export function AgentTemplateCard({ agent, onUseAgent }: AgentTemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const copyConfig = async () => {
    const json = JSON.stringify(agent.config, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    toast({ title: 'Agent config đã sao chép!', variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-5 flex flex-col group" data-testid="agent-template-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
            <Bot className="h-4.5 w-4.5 h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="font-semibold">{agent.name}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 flex-1">{agent.description}</p>

      <div className="rounded-lg border border-border/50 bg-muted/30 p-3 mb-4">
        <pre className="text-xs font-mono overflow-x-auto" aria-label={`Agent config: ${agent.name}`}>
          {JSON.stringify(agent.config, null, 2)}
        </pre>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onUseAgent(agent)}
          aria-label={`Sử dụng agent: ${agent.name}`}
        >
          <Settings className="h-4 w-4 mr-1" aria-hidden="true" />
          Sử dụng agent
        </Button>
        <Button size="sm" variant="ghost" onClick={copyConfig} aria-label="Sao chép agent config" className="text-muted-foreground hover:text-foreground">
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}