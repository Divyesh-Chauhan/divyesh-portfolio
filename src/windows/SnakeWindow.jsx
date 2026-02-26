import React, { useState, useEffect, useCallback, useRef } from 'react'

const GRID = 20
const CELL = 18
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIR = { x: 1, y: 0 }
const randomFood = (snake) => {
    let pos
    do { pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) } }
    while (snake.some(s => s.x === pos.x && s.y === pos.y))
    return pos
}

export default function SnakeWindow() {
    const [snake, setSnake] = useState(INITIAL_SNAKE)
    const [dir, setDir] = useState(INITIAL_DIR)
    const [food, setFood] = useState({ x: 15, y: 10 })
    const [running, setRunning] = useState(false)
    const [dead, setDead] = useState(false)
    const [score, setScore] = useState(0)
    const [best, setBest] = useState(() => Number(localStorage.getItem('snake_best') || 0))
    const dirRef = useRef(dir)
    dirRef.current = dir

    const reset = () => {
        const s = INITIAL_SNAKE
        setSnake(s); setDir(INITIAL_DIR); dirRef.current = INITIAL_DIR
        setFood(randomFood(s)); setDead(false); setScore(0); setRunning(false)
    }

    const tick = useCallback(() => {
        setSnake(prev => {
            const d = dirRef.current
            const head = { x: prev[0].x + d.x, y: prev[0].y + d.y }
            // wall collision
            if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
                setRunning(false); setDead(true); return prev
            }
            // self collision
            if (prev.some(s => s.x === head.x && s.y === head.y)) {
                setRunning(false); setDead(true); return prev
            }
            const newSnake = [head, ...prev]
            setFood(f => {
                if (head.x === f.x && head.y === f.y) {
                    setScore(s => {
                        const ns = s + 10
                        setBest(b => { const nb = Math.max(b, ns); localStorage.setItem('snake_best', nb); return nb })
                        return ns
                    })
                    setFood(randomFood(newSnake))
                    return f // keep old food until new one is set next render
                }
                newSnake.pop()
                return f
            })
            return newSnake
        })
    }, [])

    useEffect(() => {
        if (!running) return
        const id = setInterval(tick, 130)
        return () => clearInterval(id)
    }, [running, tick])

    useEffect(() => {
        const onKey = (e) => {
            const map = {
                ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
                w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
            }
            const nd = map[e.key]
            if (!nd) return
            e.preventDefault()
            // Prevent 180 turns
            if (nd.x + dirRef.current.x === 0 && nd.y + dirRef.current.y === 0) return
            setDir(nd); dirRef.current = nd
            if (!running && !dead) setRunning(true)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [running, dead])

    const size = GRID * CELL

    return (
        <div className="h-full flex flex-col items-center justify-center gap-3 p-4 text-white select-none"
            style={{ background: 'rgba(5,15,30,0.8)' }}>
            {/* Score */}
            <div className="flex gap-6 text-sm">
                <span>Score: <b className="text-green-400">{score}</b></span>
                <span>Best: <b className="text-yellow-400">{best}</b></span>
            </div>

            {/* Grid */}
            <div style={{
                position: 'relative', width: size, height: size, background: 'rgba(0,0,0,0.6)',
                border: '2px solid rgba(94,162,216,0.3)', borderRadius: 6, overflow: 'hidden', flexShrink: 0
            }}>
                {/* Grid lines */}
                {Array.from({ length: GRID }).map((_, i) => (
                    <React.Fragment key={i}>
                        <div style={{ position: 'absolute', left: i * CELL, top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.03)' }} />
                        <div style={{ position: 'absolute', top: i * CELL, left: 0, height: 1, width: '100%', background: 'rgba(255,255,255,0.03)' }} />
                    </React.Fragment>
                ))}
                {/* Snake */}
                {snake.map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: s.x * CELL + 1, top: s.y * CELL + 1,
                        width: CELL - 2, height: CELL - 2, borderRadius: i === 0 ? 4 : 2,
                        background: i === 0
                            ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                            : `rgba(34,197,94,${1 - i * 0.03 > 0.4 ? 1 - i * 0.03 : 0.4})`,
                        boxShadow: i === 0 ? '0 0 8px rgba(74,222,128,0.6)' : undefined,
                    }} />
                ))}
                {/* Food */}
                <div style={{
                    position: 'absolute', left: food.x * CELL + 2, top: food.y * CELL + 2,
                    width: CELL - 4, height: CELL - 4, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #fb923c, #dc2626)',
                    boxShadow: '0 0 10px rgba(251,146,60,0.8)',
                }} />
                {/* Overlay */}
                {(!running || dead) && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12
                    }}>
                        {dead && <p className="text-red-400 font-bold text-lg">💀 Game Over!</p>}
                        {!dead && <p className="text-blue-300 text-sm">Press arrow key or WASD to start</p>}
                        {dead && (
                            <button onClick={reset}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg,#1f72c2,#0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                                Play Again
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500">Arrow keys / WASD to move</p>
        </div>
    )
}
