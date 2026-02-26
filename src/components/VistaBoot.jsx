import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Synthesize the Vista startup chime using Web Audio API
function playVistaChime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        // Approximate the iconic Vista startup melody
        const melody = [
            { freq: 392.0, t: 0.0, dur: 0.6, vol: 0.18 }, // G4
            { freq: 523.25, t: 0.5, dur: 0.5, vol: 0.20 }, // C5
            { freq: 659.25, t: 0.9, dur: 0.5, vol: 0.22 }, // E5
            { freq: 783.99, t: 1.3, dur: 0.6, vol: 0.20 }, // G5
            { freq: 659.25, t: 1.8, dur: 0.4, vol: 0.18 }, // E5
            { freq: 987.77, t: 2.1, dur: 0.4, vol: 0.22 }, // B5
            { freq: 1046.5, t: 2.45, dur: 1.2, vol: 0.25 }, // C6 (sustained)
        ]

        melody.forEach(({ freq, t, dur, vol }) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const reverb = ctx.createBiquadFilter()

            reverb.type = 'lowpass'
            reverb.frequency.value = 4000

            osc.connect(reverb)
            reverb.connect(gain)
            gain.connect(ctx.destination)

            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + t)

            gain.gain.setValueAtTime(0, ctx.currentTime + t)
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + t + 0.08)
            gain.gain.setValueAtTime(vol, ctx.currentTime + t + dur * 0.5)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + dur)

            osc.start(ctx.currentTime + t)
            osc.stop(ctx.currentTime + t + dur + 0.05)
        })
    } catch (e) {
        // Audio not supported — silent fallback
    }
}

export default function VistaBoot({ onComplete }) {
    const [phase, setPhase] = useState('black')   // black → logo → loading → done
    const [progress, setProgress] = useState(0)
    const [glowPulse, setGlowPulse] = useState(false)
    const soundPlayed = useRef(false)

    useEffect(() => {
        // Phase sequence timings
        const t1 = setTimeout(() => setPhase('logo'), 600)
        const t2 = setTimeout(() => {
            setPhase('loading')
            // Start progress bar
            let p = 0
            const interval = setInterval(() => {
                p += Math.random() * 6 + 2
                if (p >= 100) {
                    p = 100
                    clearInterval(interval)
                }
                setProgress(p)
            }, 80)
        }, 2000)

        // Play chime at the right moment
        const t3 = setTimeout(() => {
            if (!soundPlayed.current) {
                soundPlayed.current = true
                playVistaChime()
            }
            setGlowPulse(true)
        }, 2400)

        // Complete boot
        const t4 = setTimeout(() => {
            setPhase('fadeout')
            setTimeout(onComplete, 700)
        }, 5500)

        return () => [t1, t2, t3, t4].forEach(clearTimeout)
    }, [onComplete])

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    key="boot"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
                    transition={{ duration: 0.7 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        background: '#000',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 40,
                    }}
                >
                    {/* Vista Orb */}
                    <AnimatePresence>
                        {(phase === 'logo' || phase === 'loading' || phase === 'fadeout') && (
                            <motion.div
                                key="orb"
                                initial={{ opacity: 0, scale: 0.4 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                style={{ position: 'relative' }}
                            >
                                {/* Outer glow rings */}
                                <motion.div
                                    animate={{ scale: glowPulse ? [1, 1.15, 1] : 1, opacity: glowPulse ? [0.4, 0.7, 0.4] : 0.4 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{
                                        position: 'absolute', inset: -40, borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(30,120,255,0.25) 0%, transparent 70%)',
                                        pointerEvents: 'none',
                                    }}
                                />

                                {/* Main orb */}
                                <div style={{
                                    width: 180, height: 180, borderRadius: '50%',
                                    background: 'radial-gradient(circle at 35% 30%, rgba(120,180,255,0.95) 0%, rgba(30,100,220,0.9) 40%, rgba(10,50,160,0.95) 80%, rgba(5,20,80,1) 100%)',
                                    boxShadow: '0 0 80px rgba(50,130,255,0.6), 0 0 30px rgba(50,130,255,0.4), inset 0 2px 20px rgba(255,255,255,0.3)',
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    {/* Shine */}
                                    <div style={{
                                        position: 'absolute', top: '12%', left: '20%',
                                        width: '55%', height: '35%',
                                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 70%)',
                                        borderRadius: '50%', transform: 'rotate(-15deg)',
                                        filter: 'blur(8px)',
                                    }} />
                                    {/* DC initials in orb */}
                                    <div style={{
                                        position: 'absolute', inset: 0, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: 38, fontWeight: 900, color: 'rgba(255,255,255,0.95)',
                                        fontFamily: 'Segoe UI, Inter, sans-serif', letterSpacing: -1,
                                        textShadow: '0 2px 12px rgba(0,80,200,0.8)',
                                    }}>
                                        DC
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Text block */}
                    <AnimatePresence>
                        {(phase === 'logo' || phase === 'loading' || phase === 'fadeout') && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{
                                    fontFamily: 'Segoe UI, Inter, sans-serif',
                                    fontSize: 28, fontWeight: 300, color: '#fff',
                                    letterSpacing: 8, textTransform: 'uppercase',
                                    marginBottom: 6,
                                }}>
                                    Divyesh Portfolio
                                </div>
                                <div style={{
                                    fontFamily: 'Segoe UI, Inter, sans-serif',
                                    fontSize: 12, color: 'rgba(120,170,255,0.6)',
                                    letterSpacing: 4, textTransform: 'uppercase',
                                }}>
                                    Copyright © 2025
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading bar */}
                    <AnimatePresence>
                        {(phase === 'loading' || phase === 'fadeout') && (
                            <motion.div
                                key="progressbar"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: 260 }}
                            >
                                <div style={{
                                    height: 3, borderRadius: 2,
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    overflow: 'hidden',
                                }}>
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        transition={{ ease: 'easeOut', duration: 0.3 }}
                                        style={{
                                            height: '100%', borderRadius: 2,
                                            background: 'linear-gradient(90deg, rgba(30,100,220,0.8), rgba(100,170,255,1), rgba(30,100,220,0.8))',
                                            boxShadow: '0 0 8px rgba(100,170,255,0.8)',
                                        }}
                                    />
                                </div>
                                <div style={{
                                    marginTop: 10, textAlign: 'center',
                                    fontSize: 11, color: 'rgba(120,170,255,0.5)',
                                    fontFamily: 'Segoe UI, sans-serif', letterSpacing: 2,
                                    textTransform: 'uppercase',
                                }}>
                                    Loading…
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
