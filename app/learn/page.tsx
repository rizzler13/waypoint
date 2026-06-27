'use client';

import dynamic from 'next/dynamic';

// Dynamically import WalkthroughApp with SSR disabled to prevent hydration mismatch (due to HTMLCanvasElement usage)
const WalkthroughApp = dynamic(() => import('@/components/WalkthroughApp'), {
  ssr: false,
});

export default function LearnPage() {
  return <WalkthroughApp />;
}
