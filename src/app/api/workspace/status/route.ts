import { NextResponse } from 'next/server';
import { workspaceProviderRegistry } from '@/lib/ai/registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = workspaceProviderRegistry.getPublicStatus();
  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
