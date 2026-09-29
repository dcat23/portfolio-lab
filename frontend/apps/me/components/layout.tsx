import React from 'react';
import { CursorGlow } from '@feature/ui/components/cursor-glow';

interface Props {
  children: React.ReactNode;
}

export function Layout(props: Props): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <main className="relative z-10">
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
