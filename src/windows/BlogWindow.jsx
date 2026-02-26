import React, { useState } from 'react'
import { useCmsStore } from '../store/cmsStore'

// Simple markdown-ish renderer: bold, italic, headings, --- divider, links
function renderContent(text) {
    if (!text) return null
    return text.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} style={{ color: '#60a5fa', fontWeight: 700, fontSize: 15, marginTop: 14, marginBottom: 4 }}>{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} style={{ color: '#93c5fd', fontWeight: 800, fontSize: 18, marginTop: 16, marginBottom: 6 }}>{line.slice(2)}</h2>
        if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '10px 0' }} />
        if (line === '') return <br key={i} />
        // Bold **text**, italic *text*
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
        return (
            <p key={i} style={{ margin: '2px 0', lineHeight: 1.65, color: '#d1d5db', fontSize: 13 }}>
                {parts.map((p, j) => {
                    if (p.startsWith('**') && p.endsWith('**')) return <strong key={j} style={{ color: '#f9fafb' }}>{p.slice(2, -2)}</strong>
                    if (p.startsWith('*') && p.endsWith('*')) return <em key={j} style={{ color: '#c4b5fd' }}>{p.slice(1, -1)}</em>
                    return p
                })}
            </p>
        )
    })
}

export default function BlogWindow() {
    const { blogs } = useCmsStore()
    const [selected, setSelected] = useState(null)
    const [filterTag, setFilterTag] = useState('')

    const sorted = [...(blogs || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
    const allTags = [...new Set(sorted.flatMap(b => b.tags || []))]
    const filtered = filterTag
        ? sorted.filter(b => (b.tags || []).includes(filterTag))
        : sorted

    if (blogs.length === 0) {
        return (
            <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: '#6b7280', gap: 12, padding: 32,
                background: 'rgba(5,15,30,0.6)',
            }}>
                <span style={{ fontSize: 48 }}>📝</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#9ca3af' }}>No blog posts yet</p>
                <p style={{ fontSize: 12, textAlign: 'center', maxWidth: 260 }}>
                    Log into the Admin Panel and head to the Blog section to write your first post.
                </p>
            </div>
        )
    }

    // ── Post reader view ──────────────────────────────────────────────────────
    if (selected) {
        return (
            <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                background: 'rgba(5,15,30,0.7)', color: 'white',
            }}>
                {/* Back bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', flexShrink: 0,
                }}>
                    <button
                        onClick={() => setSelected(null)}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 6, color: '#93c5fd', fontSize: 12, padding: '4px 10px', cursor: 'pointer',
                        }}
                    >← Back</button>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {new Date(selected.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f9fafb', marginBottom: 10, lineHeight: 1.3 }}>
                        {selected.title}
                    </h1>
                    {selected.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                            {selected.tags.map(t => (
                                <span key={t} style={{
                                    padding: '2px 9px', borderRadius: 99, fontSize: 10, fontWeight: 600,
                                    background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
                                    color: '#93c5fd',
                                }}>{t}</span>
                            ))}
                        </div>
                    )}
                    <div>{renderContent(selected.content)}</div>
                </div>
            </div>
        )
    }

    // ── Blog list view ────────────────────────────────────────────────────────
    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'rgba(5,15,30,0.7)', color: 'white',
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)', flexShrink: 0,
            }}>
                <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, color: '#60a5fa', fontWeight: 700, marginBottom: 8 }}>
                    Blog Posts
                </h2>
                {/* Tag filter pills */}
                {allTags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setFilterTag('')}
                            style={{
                                padding: '2px 10px', borderRadius: 99, fontSize: 10, fontWeight: 600,
                                background: !filterTag ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.06)',
                                border: `1px solid ${!filterTag ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.12)'}`,
                                color: !filterTag ? '#93c5fd' : '#9ca3af', cursor: 'pointer',
                            }}
                        >All</button>
                        {allTags.map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterTag(t === filterTag ? '' : t)}
                                style={{
                                    padding: '2px 10px', borderRadius: 99, fontSize: 10, fontWeight: 600,
                                    background: filterTag === t ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.06)',
                                    border: `1px solid ${filterTag === t ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.12)'}`,
                                    color: filterTag === t ? '#93c5fd' : '#9ca3af', cursor: 'pointer',
                                }}
                            >{t}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* Post list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(post => (
                    <button
                        key={post.id}
                        onClick={() => setSelected(post)}
                        style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10, padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
                            transition: 'border-color 0.15s, background 0.15s', color: 'white',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    >
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#f9fafb', marginBottom: 4, lineHeight: 1.3 }}>
                            {post.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        {/* Preview */}
                        <p style={{
                            fontSize: 12, color: '#9ca3af', lineHeight: 1.5,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            marginBottom: post.tags?.length ? 8 : 0,
                        }}>
                            {post.content?.replace(/[#*-]/g, '').replace(/\n+/g, ' ').trim()}
                        </p>
                        {post.tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {post.tags.map(t => (
                                    <span key={t} style={{
                                        padding: '1px 7px', borderRadius: 99, fontSize: 9, fontWeight: 600,
                                        background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', color: '#7dd3fc',
                                    }}>{t}</span>
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
