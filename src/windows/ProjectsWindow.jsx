import React, { useState, useEffect } from 'react'
import { useCmsStore } from '../store/cmsStore'
import { Star, GitFork, Circle, Globe, Github } from 'lucide-react'

const LANG_COLORS = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', 'C++': '#f34b7d', HTML: '#e34c26', CSS: '#563d7c',
    Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
    Swift: '#F05138', Kotlin: '#7F52FF', Dart: '#00B4AB', Shell: '#89e051',
}

function LanguageChip({ lang }) {
    const color = LANG_COLORS[lang] || '#aaa'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 7px', borderRadius: 99, fontSize: 10, fontWeight: 600,
            background: `${color}22`, color, border: `1px solid ${color}44`,
        }}>
            <Circle size={6} fill={color} stroke="none" />
            {lang}
        </span>
    )
}

// Labeled pill button for repo actions
function RepoPill({ href, icon, label, accent }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                background: accent === 'blue'
                    ? 'linear-gradient(135deg,rgba(31,114,194,0.5),rgba(94,162,216,0.25))'
                    : 'rgba(255,255,255,0.08)',
                border: accent === 'blue'
                    ? '1px solid rgba(94,162,216,0.45)'
                    : '1px solid rgba(255,255,255,0.15)',
                color: accent === 'blue' ? '#a8d4ff' : '#d1d5db',
                textDecoration: 'none',
                transition: 'filter 0.15s ease',
                cursor: 'pointer',
                flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.2)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
            {icon}
            {label}
        </a>
    )
}

export default function ProjectsWindow() {
    const { githubUsername, repoVisibility, liveLinks } = useCmsStore()
    const [repos, setRepos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!githubUsername) return
        setLoading(true)
        setError(null)
        fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
            .then(r => {
                if (!r.ok) throw new Error(`GitHub API error: ${r.status}`)
                return r.json()
            })
            .then(data => { setRepos(data); setLoading(false) })
            .catch(err => { setError(err.message); setLoading(false) })
    }, [githubUsername])

    const visibleRepos = repos.filter(r => {
        const vis = repoVisibility[r.name]
        return vis === undefined ? true : vis
    })

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: 20, color: 'white', userSelect: 'text' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, color: '#60a5fa', fontWeight: 700 }}>
                    GitHub Projects
                </h2>
                {githubUsername && (
                    <a
                        href={`https://github.com/${githubUsername}`}
                        target="_blank" rel="noreferrer"
                        style={{ fontSize: 11, color: '#93c5fd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                        @{githubUsername} <Github size={11} />
                    </a>
                )}
            </div>

            {/* Loading skeletons */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ height: 90, borderRadius: 8, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ borderRadius: 8, padding: 16, textAlign: 'center', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)' }}>
                    <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>
                    <p style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>Check GitHub username in Admin Panel</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && visibleRepos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>💼</p>
                    <p style={{ fontSize: 13 }}>No projects to show. Check Admin Panel settings.</p>
                </div>
            )}

            {/* Repo cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visibleRepos.map(repo => {
                    const liveUrl = liveLinks?.[repo.name]
                    return (
                        <div
                            key={repo.id}
                            style={{
                                borderRadius: 10, padding: '12px 14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.09)',
                                transition: 'border-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}
                        >
                            {/* Repo name */}
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4, wordBreak: 'break-all' }}>
                                {repo.name}
                            </p>

                            {/* Description */}
                            {repo.description && (
                                <p style={{
                                    color: '#9ca3af', fontSize: 11, lineHeight: 1.5, marginBottom: 8,
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                    {repo.description}
                                </p>
                            )}

                            {/* Chips row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                                {repo.language && <LanguageChip lang={repo.language} />}
                                {repo.stargazers_count > 0 && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#fbbf24bb' }}>
                                        <Star size={9} fill="currentColor" /> {repo.stargazers_count}
                                    </span>
                                )}
                                {repo.forks_count > 0 && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#9ca3af' }}>
                                        <GitFork size={9} /> {repo.forks_count}
                                    </span>
                                )}
                                {repo.fork && <span style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>fork</span>}
                            </div>

                            {/* ── Action buttons (always visible) ── */}
                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                                {/* Git Repo — always shown */}
                                <RepoPill
                                    href={repo.html_url}
                                    icon={<Github size={11} />}
                                    label="Git Repo"
                                    accent="gray"
                                />
                                {/* Visit Live — only shown when URL is set */}
                                {liveUrl && (
                                    <RepoPill
                                        href={liveUrl}
                                        icon={<Globe size={11} />}
                                        label="Visit Live"
                                        accent="blue"
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
