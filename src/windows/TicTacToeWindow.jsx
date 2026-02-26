import React, { useState, useCallback } from 'react'

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],          // diags
]

function checkWinner(board) {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line: [a, b, c] }
    }
    if (board.every(Boolean)) return { winner: 'draw', line: [] }
    return null
}

// Minimax AI (unbeatable)
const minimax = (board, isMax, depth = 0) => {
    const r = checkWinner(board)
    if (r) {
        if (r.winner === 'O') return 10 - depth
        if (r.winner === 'X') return depth - 10
        return 0
    }
    const scores = board.map((cell, i) => {
        if (cell) return isMax ? -Infinity : Infinity
        const nb = [...board]; nb[i] = isMax ? 'O' : 'X'
        return minimax(nb, !isMax, depth + 1)
    })
    return isMax ? Math.max(...scores) : Math.min(...scores)
}

const bestMove = (board) => {
    let best = -Infinity, move = 0
    board.forEach((cell, i) => {
        if (cell) return
        const nb = [...board]; nb[i] = 'O'
        const s = minimax(nb, false)
        if (s > best) { best = s; move = i }
    })
    return move
}

export default function TicTacToeWindow() {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [xTurn, setXTurn] = useState(true)
    const [result, setResult] = useState(null)
    const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 })

    const reset = () => { setBoard(Array(9).fill(null)); setXTurn(true); setResult(null) }

    const handleClick = useCallback((i) => {
        if (!xTurn || board[i] || result) return
        const nb = [...board]; nb[i] = 'X'
        const r = checkWinner(nb)
        if (r) { setBoard(nb); setResult(r); setScores(s => ({ ...s, [r.winner]: s[r.winner] + 1 })); return }
        // AI move
        const ai = bestMove(nb)
        if (ai !== undefined && nb[ai] === null) {
            nb[ai] = 'O'
            const r2 = checkWinner(nb)
            if (r2) { setBoard(nb); setResult(r2); setScores(s => ({ ...s, [r2.winner]: s[r2.winner] + 1 })); return }
        }
        setBoard(nb)
    }, [board, xTurn, result])

    const isWinCell = (i) => result?.line?.includes(i)

    return (
        <div className="h-full flex flex-col items-center justify-center gap-4 p-5 text-white select-none"
            style={{ background: 'rgba(5,15,30,0.8)' }}>
            {/* Scores */}
            <div className="flex gap-5 text-sm">
                <div className="text-center"><div className="text-blue-400 font-bold text-lg">{scores.X}</div><div className="text-gray-500 text-xs">You (X)</div></div>
                <div className="text-center"><div className="text-gray-400 font-bold text-lg">{scores.draw}</div><div className="text-gray-500 text-xs">Draw</div></div>
                <div className="text-center"><div className="text-red-400 font-bold text-lg">{scores.O}</div><div className="text-gray-500 text-xs">AI (O)</div></div>
            </div>

            {/* Status */}
            <div className="text-sm h-6 font-semibold">
                {result
                    ? result.winner === 'draw' ? <span className="text-gray-400">It's a draw!</span>
                        : result.winner === 'X' ? <span className="text-green-400">🎉 You win!</span>
                            : <span className="text-red-400">🤖 AI wins!</span>
                    : <span className="text-blue-300">Your turn (X)</span>
                }
            </div>

            {/* Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: 240, height: 240 }}>
                {board.map((cell, i) => (
                    <button key={i} onClick={() => handleClick(i)}
                        style={{
                            borderRadius: 10, fontSize: 42, fontWeight: 900, cursor: cell || result ? 'default' : 'pointer',
                            background: isWinCell(i)
                                ? 'rgba(74,222,128,0.2)'
                                : 'rgba(255,255,255,0.07)',
                            border: isWinCell(i)
                                ? '2px solid rgba(74,222,128,0.6)'
                                : '2px solid rgba(255,255,255,0.1)',
                            color: cell === 'X' ? '#60a5fa' : '#f87171',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease',
                            transform: isWinCell(i) ? 'scale(1.08)' : 'scale(1)',
                            boxShadow: isWinCell(i) ? '0 0 20px rgba(74,222,128,0.3)' : 'none'
                        }}>
                        {cell}
                    </button>
                ))}
            </div>

            <button onClick={reset}
                className="mt-1 px-6 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#1f72c2,#0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                {result ? 'Play Again' : 'Reset'}
            </button>
            <p className="text-xs text-gray-600">You are X · AI never loses</p>
        </div>
    )
}
