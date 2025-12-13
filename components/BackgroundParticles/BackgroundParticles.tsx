'use client'

import { useState, useEffect } from 'react'
import styles from './BackgroundParticles.module.scss'

type ParticleStyle = {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
  '--random-x': string
  '--random-y': string
}

type StarStyle = {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

type CometStyle = {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<ParticleStyle[]>([])
  const [stars, setStars] = useState<StarStyle[]>([])
  const [comets, setComets] = useState<CometStyle[]>([])

  useEffect(() => {
    const particleStyles: ParticleStyle[] = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${10 + Math.random() * 15}s`,
      '--random-x': `${-50 + Math.random() * 100}px`,
      '--random-y': `${-50 + Math.random() * 100}px`,
    }))

    const starStyles: StarStyle[] = Array.from({ length: 120 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }))

    const cometStyles: CometStyle[] = Array.from({ length: 8 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${8 + Math.random() * 12}s`,
    }))

    setParticles(particleStyles)
    setStars(starStyles)
    setComets(cometStyles)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.blob4} />
      <div className={styles.blob5} />
      
      <div className={styles.particles}>
        {particles.map((style, i) => (
          <div
            key={i}
            className={styles.particle}
            style={style as React.CSSProperties}
          />
        ))}
      </div>

      <div className={styles.ripples}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={styles.ripple}
            style={{
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.stars}>
        {stars.map((style, i) => (
          <div
            key={`star-${i}`}
            className={`${styles.star} ${i % 3 === 0 ? styles.starLarge : i % 2 === 0 ? styles.starMedium : styles.starSmall}`}
            style={style}
          />
        ))}
      </div>

      <div className={styles.comets}>
        {comets.map((style, i) => (
          <div
            key={`comet-${i}`}
            className={styles.comet}
            style={style}
          />
        ))}
      </div>
    </div>
  )
}
