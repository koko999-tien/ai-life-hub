'use client';

import { ToastProvider as ToastProviderContext, useToast } from '@/components/layout/Providers';

export function Toaster() {
  return <ToastProviderContext />;
}