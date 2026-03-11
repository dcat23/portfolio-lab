import React from 'react';
import { CursorGlow } from '../components/cursor-glow';
import { Header } from '../components/header';
import { HeroSection } from '../components/hero-section';
import { ProjectsGrid } from '../components/projects-grid';
import { LabNotes } from '../components/lab-notes';
import { Workbench } from '../components/workbench';
import { Footer } from '../components/footer';

interface Props {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Index(props: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <ProjectsGrid />
        <LabNotes />
        <Workbench />
        <Footer />
      </div>
    </main>
  );
}
