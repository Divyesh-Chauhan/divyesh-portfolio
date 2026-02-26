import React, { useState } from 'react'
import { useCmsStore } from '../store/cmsStore'
import { Github, Linkedin, Download, ExternalLink, Star, Send, CheckCircle, XCircle, Circle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const DEV_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_DEV_TEMPLATE_ID || ''
const REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

const LANG_COLORS = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8',
    Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
}

function MobileSection({ id, title, children }) {
    return (
        <section id={id} className="py-12 px-5">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-blue-500" />
                    {title}
                </h2>
                {children}
            </div>
        </section>
    )
}

export default function MobileLayout() {
    const { aboutText, avatarUrl, skills, githubUsername, repoVisibility, socialLinks, resumeUrl, education, blogs, liveLinks } = useCmsStore()
    const [repos, setRepos] = React.useState([])
    const [reposLoaded, setReposLoaded] = React.useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sending, setSending] = useState(false)
    const [toast, setToast] = useState(null)
    const [booting, setBooting] = useState(true)

    React.useEffect(() => {
        // Simulate a quick boot sequence for mobile
        const timer = setTimeout(() => setBooting(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    React.useEffect(() => {
        if (!githubUsername) return
        fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
            .then(r => r.json()).then(data => { setRepos(data); setReposLoaded(true) }).catch(() => setReposLoaded(true))
    }, [githubUsername])

    const visibleRepos = repos.filter(r => {
        const vis = repoVisibility[r.name]
        return vis === undefined ? true : vis
    })

    const handleSend = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            const devParams = {
                name: form.name,
                userEmail: form.email,
                message: form.message,
                time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                email: 'syncodexide@gmail.com',
            }
            const replyParams = { name: form.name, email: form.email }
            await emailjs.send(SERVICE_ID, DEV_TEMPLATE_ID, devParams, PUBLIC_KEY)
            await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, replyParams, PUBLIC_KEY)
            setForm({ name: '', email: '', message: '' })
            setToast({ type: 'success', msg: '✅ Message sent! I\'ll reply soon.' })
        } catch { setToast({ type: 'error', msg: '❌ Failed to send. Email me directly.' }) }
        setSending(false)
        setTimeout(() => setToast(null), 5000)
    }

    // Simple markdown renderer for blog posts
    const renderMarkdown = (text) => {
        if (!text) return null
        return text.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h3 key={i} className="text-blue-400 font-bold text-base mt-3 mb-1">{line.slice(3)}</h3>
            if (line.startsWith('# ')) return <h2 key={i} className="text-blue-300 font-black text-lg mt-4 mb-2">{line.slice(2)}</h2>
            if (line === '---') return <hr key={i} className="border-white/10 my-3" />
            if (line === '') return <div key={i} className="h-2" />
            const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
            return (
                <p key={i} className="text-sm text-gray-300 leading-relaxed my-0.5">
                    {parts.map((p, j) => {
                        if (p.startsWith('**') && p.endsWith('**')) return <strong key={j} className="text-white">{p.slice(2, -2)}</strong>
                        if (p.startsWith('*') && p.endsWith('*')) return <em key={j} className="text-blue-200">{p.slice(1, -1)}</em>
                        return p
                    })}
                </p>
            )
        })
    }

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#projects', label: 'Projects' },
        { href: '#blog', label: 'Blog' },
        { href: '#resume', label: 'Resume' },
        { href: '#contact', label: 'Contact' },
    ]

    if (booting) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white mb-6 shadow-2xl animate-pulse"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #5ea2d8)', border: '2px solid rgba(255,255,255,0.2)' }}>DC</div>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-[loading_2s_ease-in-out_forwards]" style={{ width: '0%' }}
                        ref={el => { if (el) setTimeout(() => el.style.width = '100%', 50) }} />
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full overflow-y-auto overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0c2444 50%, #0e3060 100%)', WebkitOverflowScrolling: 'touch' }}>
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 left-4 z-50 py-3 px-4 rounded-xl text-sm font-medium text-white flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-700/90' : 'bg-red-700/90'}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Navbar */}
            <nav className="sticky top-0 z-40 px-4 py-3 overflow-x-auto whitespace-nowrap flex items-center gap-4 scrollbar-hide"
                style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt="DC" className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0" onError={e => e.target.style.display = 'none'} />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shrink-0 flex items-center justify-center text-xs font-black text-white">DC</div>
                )}
                {navLinks.map(l => (
                    <a key={l.href} href={l.href} className="text-[13px] text-gray-300 hover:text-white transition-colors font-medium shrink-0">{l.label}</a>
                ))}
            </nav>

            {/* Hero */}
            <div className="py-16 px-5 text-center">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="DC" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-xl border-4 border-white/10" onError={e => e.target.style.display = 'none'} />
                ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #1f72c2, #5ea2d8)', border: '4px solid rgba(255,255,255,0.2)' }}>DC</div>
                )}
                <h1 className="text-4xl font-black text-white mb-2">Divyesh Chauhan</h1>
                <p className="text-blue-300 text-lg">Full Stack Developer</p>
                <div className="flex justify-center flex-wrap gap-3 mt-6">
                    {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="glass-button px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white flex items-center gap-2 font-medium active:bg-white/10"><Github size={16} /> GitHub</a>}
                    {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="glass-button px-4 py-2 bg-[#0077b5]/20 border border-[#0077b5]/40 rounded-lg text-sm text-white flex items-center gap-2 font-medium active:bg-[#0077b5]/30"><Linkedin size={16} className="text-[#0077b5] drop-shadow-[0_0_8px_rgba(0,119,181,0.5)]" /> LinkedIn</a>}
                </div>
            </div>

            {/* About */}
            <MobileSection id="about" title="About Me">
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{aboutText}</p>
                {(education || []).map((edu, i) => (
                    <div key={i} className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="font-bold text-white mb-1.5">{edu.degree}</div>
                        <div className="text-blue-300 text-xs font-medium">{edu.institution}</div>
                        {edu.year && <div className="text-gray-500 text-[11px] mt-1 uppercase tracking-wider">{edu.year}</div>}
                    </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-5">
                    {(skills || []).map((s, i) => <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">{s}</span>)}
                </div>
            </MobileSection>

            {/* Projects */}
            <MobileSection id="projects" title="Projects">
                <div className="flex flex-col gap-4">
                    {visibleRepos.map(repo => {
                        const liveUrl = liveLinks?.[repo.name]
                        return (
                            <div key={repo.id} className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="p-4 flex-1">
                                    <h3 className="font-bold text-base text-white mb-2">{repo.name}</h3>
                                    {repo.description && <p className="text-gray-400 text-sm mb-4 leading-relaxed">{repo.description}</p>}
                                    <div className="flex items-center gap-3">
                                        {repo.language && <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: `${LANG_COLORS[repo.language] || '#888'}22`, color: LANG_COLORS[repo.language] || '#aaa', border: `1px solid ${LANG_COLORS[repo.language] || '#888'}44` }}>{repo.language}</span>}
                                        {repo.stargazers_count > 0 && <span className="text-xs text-yellow-500 font-semibold flex items-center gap-1"><Star size={11} fill="currentColor" />{repo.stargazers_count}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 border-t border-white/5 bg-black/20">
                                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-gray-300 hover:bg-white/5 active:bg-white/10 transition-colors">
                                        <Github size={14} /> Git Repo
                                    </a>
                                    {liveUrl ? (
                                        <a href={liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-blue-300 hover:bg-white/5 active:bg-white/10 transition-colors border-l border-white/5">
                                            <ExternalLink size={14} /> Visit Live
                                        </a>
                                    ) : <div className="border-l border-white/5" />}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </MobileSection>

            {/* Blog */}
            {blogs && blogs.length > 0 && (
                <MobileSection id="blog" title="Blog">
                    <div className="flex flex-col gap-4">
                        {[...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)).map(post => (
                            <div key={post.id} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <h3 className="font-bold text-lg text-white mb-2 leading-tight">{post.title}</h3>
                                <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold mb-4">
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                {post.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map(t => (
                                            <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">{t}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-2 text-sm text-gray-300">
                                    {renderMarkdown(post.content)}
                                </div>
                            </div>
                        ))}
                    </div>
                </MobileSection>
            )}

            {/* Resume */}
            <MobileSection id="resume" title="Links & CV">
                <a href={resumeUrl || '#'} target="_blank" rel="noreferrer" download
                    className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[13px] text-white shadow-lg active:scale-[0.98] transition-all mb-4"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                    <Download size={16} /> DOWNLOAD RESUME (PDF)
                </a>
            </MobileSection>

            {/* Contact */}
            <MobileSection id="contact" title="Contact Me">
                <form onSubmit={handleSend} className="flex flex-col gap-3">
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" className="vista-input w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-blue-500/50 outline-none transition-colors" required />
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address" className="vista-input w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-blue-500/50 outline-none transition-colors" required />
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your message..." rows={5} className="vista-input w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-blue-500/50 outline-none transition-colors resize-y" required />
                    <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 py-3.5 mt-2 rounded-xl font-bold text-[13px] text-white active:scale-[0.98] transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                        {sending ? <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> : <Send size={15} />}
                        {sending ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>
                </form>
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500 mb-2">Or email me directly at</p>
                    <a href="mailto:chauhandivyesh313@gmail.com"
                        onClick={e => { e.preventDefault(); window.open("mailto:chauhandivyesh313@gmail.com", "_self") }}
                        className="text-sm font-semibold text-blue-400 active:text-blue-300 transition-colors">
                        chauhandivyesh313@gmail.com
                    </a>
                </div>
            </MobileSection>

            <footer className="py-8 text-center text-xs text-gray-500 border-t border-white/5 mb-10">
                © {new Date().getFullYear()} Divyesh Chauhan · All rights reserved
            </footer>
        </div>
    )
}
