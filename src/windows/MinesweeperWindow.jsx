import React, { useState, useCallback } from 'react'

const ROWS = 9, COLS = 9, MINES = 10

function createBoard() {
    const mines = new Set()
    while (mines.size < MINES) mines.add(Math.floor(Math.random() * ROWS * COLS))
    const cells = Array.from({ length: ROWS * COLS }, (_, i) => ({
        mine: mines.has(i), revealed: false, flagged: false, count: 0,
    }))
    cells.forEach((cell, i) => {
        if (cell.mine) return
        const r = Math.floor(i / COLS), c = i % COLS
        let count = 0
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && cells[nr * COLS + nc].mine) count++
        }
        cell.count = count
    })
    return cells
}

// Classic Minesweeper number colors
const NUM_COLORS = ['', '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#b91c1c', '#0891b2', '#111827', '#6b7280']

export default function MinesweeperWindow() {
    const [board, setBoard] = useState(createBoard)
    const [status, setStatus] = useState('playing')
    const [firstClick, setFirstClick] = useState(true)
    const [flagCount, setFlagCount] = useState(0)

    const reset = () => { setBoard(createBoard()); setStatus('playing'); setFirstClick(true); setFlagCount(0) }

    const reveal = useCallback((idx, b) => {
        if (b[idx].revealed || b[idx].flagged) return b
        const next = [...b]
        next[idx] = { ...next[idx], revealed: true }
        if (next[idx].count === 0 && !next[idx].mine) {
            const r = Math.floor(idx / COLS), c = idx % COLS
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
                const ni = (r + dr) * COLS + (c + dc)
                if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS && !next[ni].revealed)
                    next.splice(0, next.length, ...reveal(ni, next))
            }
        }
        return next
    }, [])

    const handleClick = (idx) => {
        if (status !== 'playing' || board[idx].flagged || board[idx].revealed) return
        let b = [...board]
        if (firstClick && b[idx].mine) {
            let nb; do { nb = createBoard() } while (nb[idx].mine)
            b = nb
        }
        setFirstClick(false)
        if (b[idx].mine) {
            const next = b.map(c => c.mine ? { ...c, revealed: true } : c)
            setBoard(next); setStatus('lost'); return
        }
        const next = reveal(idx, b)
        setBoard(next)
        if (next.filter(c => !c.revealed && !c.mine).length === 0) setStatus('won')
    }

    const handleRightClick = (e, idx) => {
        e.preventDefault()
        if (status !== 'playing' || board[idx].revealed) return
        const next = [...board]
        const wasF = next[idx].flagged
        next[idx] = { ...next[idx], flagged: !wasF }
        setBoard(next)
        setFlagCount(f => wasF ? f - 1 : f + 1)
    }

    const CS = 34 // cell size

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: 16, background: 'rgba(5,15,30,0.85)',
            color: 'white', userSelect: 'none', fontFamily: 'Segoe UI, sans-serif',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 14, minWidth: 44, textAlign: 'center' }}>
                    💣 <b>{MINES - flagCount}</b>
                </span>
                <button onClick={reset} style={{
                    padding: '4px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                    background: 'linear-gradient(135deg,#1f72c2,#0d4a8a)',
                    border: '1px solid rgba(94,162,216,0.4)', color: 'white', cursor: 'pointer',
                }}>
                    {status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'}
                </button>
                <span style={{ fontSize: 14, minWidth: 44, textAlign: 'center' }}>
                    🚩 <b>{flagCount}</b>
                </span>
            </div>

            {/* Status message */}
            {status === 'won' && (
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: 13 }}>🎉 You cleared the board!</p>
            )}
            {status === 'lost' && (
                <p style={{ color: '#f87171', fontWeight: 700, fontSize: 13 }}>💥 Boom! Try again.</p>
            )}

            {/* Board */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CS}px)`,
                gap: 2,
                padding: 8,
                borderRadius: 8,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                {board.map((cell, idx) => {
                    const bg = cell.revealed
                        ? cell.mine
                            ? 'rgba(220,38,38,0.65)'
                            : 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.12)'

                    const borderColor = cell.revealed
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.25)'

                    // Text inside the cell
                    let content = null
                    let textColor = '#fff'
                    if (cell.flagged && !cell.revealed) { content = '🚩'; textColor = '#fff' }
                    else if (cell.revealed && cell.mine) { content = '💣'; textColor = '#fff' }
                    else if (cell.revealed && cell.count > 0) {
                        content = cell.count
                        textColor = NUM_COLORS[cell.count] || '#fff'
                    }

                    return (
                        <div
                            key={idx}
                            onClick={() => handleClick(idx)}
                            onContextMenu={e => handleRightClick(e, idx)}
                            style={{
                                width: CS, height: CS, borderRadius: 4,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: content && typeof content === 'number' ? 15 : 16,
                                fontWeight: 900,
                                lineHeight: 1,
                                cursor: 'pointer',
                                background: bg,
                                border: `1px solid ${borderColor}`,
                                boxShadow: cell.revealed ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)',
                                color: textColor,
                                transition: 'background 0.08s',
                                // Force number visibility with text-shadow
                                textShadow: typeof content === 'number'
                                    ? `0 0 8px ${NUM_COLORS[cell.count]}66`
                                    : 'none',
                            }}
                        >
                            {content}
                        </div>
                    )
                })}
            </div>

            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                Left click to reveal · Right click to flag
            </p>
        </div>
    )
}
