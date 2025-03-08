'use client';

import React from 'react';
import RamadanHero from '@/components/RamadanHero';
import RamadanContent from '@/components/RamadanContent';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Header lang="sv" pages={[]} links={[]} />

      <RamadanHero
        title={
          <>
            Läsvärda nyheter,<br />
            historier och sånt
          </>
        }
        subtitle={
          <>
            Här kan du se alla kommande händelser i Gottsunda Centrum. Vi erbjuder aktiviteter för barn,<br />
            ungdomar och vuxna, alltifrån odlingskurser och schacktävlingar till större evenemang och<br />
            tillställningar.
          </>
        }
      />

      {/* The new content block with the featured card + small cards */}
      <RamadanContent />

      <Footer lang="sv" links={[]} />
    </>
  );
}
