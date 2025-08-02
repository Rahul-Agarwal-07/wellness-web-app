'use client';

import React from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () =>
  {
    const token = localStorage.getItem('token');

    if(token) router.push('/dashboard');
    else router.push('/auth');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}></div>

      <nav className={styles.navbar}>
        <div className={styles.logo}>WellNest</div>
        <div className={styles.authButtons}>
          <button onClick={() => router.push('/auth?flag=true')} className={styles.button}>Sign In</button>
          <button onClick={() => router.push('/auth?flag=false')} className={styles.buttonOutline}>Sign Up</button>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroCard}>
          <h1 className={styles.title}>Your Journey to Wellness Starts Here</h1>
          <p className={styles.subtitle}>
            Experience guided sessions in meditation, mindfulness, yoga, and more —
            all designed to bring balance and peace to your life.
          </p>
          <button onClick={() => handleGetStarted()} className={styles.ctaButton}>
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}
