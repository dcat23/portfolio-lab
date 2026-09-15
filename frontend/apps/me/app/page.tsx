import React from 'react';
import { CursorGlow } from '@feature/ui/components/cursor-glow';

interface Props {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Index(props: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        Home
      </div>
    </main>
  );
}
