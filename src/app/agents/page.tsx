import { Metadata } from 'next';
import { AgentDirectory } from '@/components/agents/AgentDirectory';

export const metadata: Metadata = {
  title: 'Enterprise AI Agent Blueprints & Templates | AI Life Hub',
  description: 'Thư viện cấu hình AI Agent chuyên sâu sẵn sàng triển khai: Code Architect, Research Analyst, Copywriter, Finance và DevOps.',
  openGraph: {
    title: 'Enterprise AI Agent Blueprints & Templates | AI Life Hub',
    description: 'Bộ sưu tập System Prompts, Tool Specs và cấu hình .cursorrules / CLAUDE.md cho các Agent tự hành.',
    type: 'website',
  },
};

export default function AgentsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <AgentDirectory />
    </div>
  );
}
