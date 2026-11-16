'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface PromptBuilderProps {
  skillName: string;
  initialPrompt: string;
}

export function PromptBuilder({ skillName, initialPrompt }: PromptBuilderProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generated, setGenerated] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const openModal = () => {
    setPrompt(initialPrompt);
    setGenerated(null);
    setIsGenerating(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const generatePrompt = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skillName, template: prompt }),
      });
      const data = await response.json();
      setGenerated(data.generated || prompt);
    } catch {
      setGenerated(prompt);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={openModal} variant="outline" size="lg" className="w-full">
        <Wand2 className="h-5 w-5 mr-2" aria-hidden="true" />
        Mở trình xây dựng
      </Button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Prompt Builder">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-xl border border-border/50 shadow-2xl animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Prompt Builder
          </h2>
          <Button variant="ghost" size="icon" onClick={closeModal} aria-label="Đóng">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="prompt-builder-input" className="label block mb-2">
              Prompt template
            </label>
            <textarea
              id="prompt-builder-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-40 rounded-lg border border-input bg-background p-4 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Nhập template prompt..."
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button onClick={generatePrompt} disabled={isGenerating || !prompt.trim()} variant="secondary">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                  Đang xây dựng...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
                  Tự động hoàn thiện prompt
                </>
              )}
            </Button>
          </div>

          {generated && (
            <div className="animate-fade-in">
              <label className="label block mb-2">
                Prompt đã xây dựng
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-muted-foreground/50">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <textarea
                  value={generated}
                  readOnly
                  className="w-full min-h-40 rounded-lg border border-primary/30 bg-background p-4 pl-10 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Generated prompt"
                />
                <Button
                  size="sm"
                  className="absolute bottom-3 right-3"
                  onClick={() => {
                    navigator.clipboard.writeText(generated);
                  }}
                >
                  Copy to clipboard
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <Button variant="outline" onClick={closeModal}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function PromptBuilderButton({ skillName, initialPrompt }: { skillName: string; initialPrompt?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="lg" className="w-full">
        <Wand2 className="h-5 w-5 mr-2" aria-hidden="true" />
        Mở trình xây dựng
      </Button>
      {open && <PromptBuilder skillName={skillName} initialPrompt={initialPrompt || ""} />}
    </>
  );
}
