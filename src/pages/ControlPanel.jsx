import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'


const _E = 'YWRtaW5AcG9ydGZvbGlvLmRldg=='
const _P = 'RGl2dXVAMjAwNSMxNSFDaGF1'
const _checkCredentials = (email, pass) =>
    email === atob(_E) && pass === atob(_P)
// ─────────────────────────────────────────────────────────────────────────────

export default function ControlPanel() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const handleLogin = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        setTimeout(() => {
            if (_checkCredentials(email, password)) {
                sessionStorage.setItem('admin_auth', 'true')
                navigate('/admin-dashboard')
            } else {
                setError('Invalid email or password.')
            }
            setLoading(false)
        }, 500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0c2444 60%, #0e3060 100%)' }}>
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-3 shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #1f72c2, #5ea2d8)', border: '2px solid rgba(255,255,255,0.2)' }}>
                        DC
                    </div>
                    <h1 className="text-white font-bold text-xl">Portfolio Admin</h1>
                    <p className="text-blue-300/70 text-sm mt-1">Control Panel</p>
                </div>

                <div className="rounded-2xl p-6 glass-dark shadow-2xl" style={{ border: '1px solid rgba(100,160,255,0.2)' }}>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="vista-input"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="vista-input pr-10"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-xs flex items-center gap-1.5 px-3 py-2 rounded"
                                style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white mt-1 transition-all hover:brightness-110 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}
                        >
                            {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> : <Lock size={15} />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-4">
                    <a href="/" className="text-blue-400/60 hover:text-blue-300 text-xs transition-colors">← Back to Portfolio</a>
                </div>
            </div>
        </div>
    )
}
