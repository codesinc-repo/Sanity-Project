'use client';

import React from 'react';
import classes from './RamadanHero.module.css';

interface RamadanHeroProps {
  title?: React.ReactNode;   // <-- changed to ReactNode
  subtitle?: React.ReactNode; // <-- changed to ReactNode
}

export default function RamadanHero({
  title = 'Läsvärda nyheter, historier och sånt',
  subtitle = 'Här kan du se alla kommande händelser i Gottsunda Centrum...',
}: RamadanHeroProps) {
  return (
    <section className={classes.heroSection}>
      <div className={classes.heroInner}>
        <h1 className={classes.heroTitle}>{title}</h1>
        <p className={classes.heroSubtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
