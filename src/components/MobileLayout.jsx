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
    const { aboutText, skills, githubUsername, repoVisibility, socialLinks, resumeUrl, education } = useCmsStore()
    const [repos, setRepos] = React.useState([])
    const [reposLoaded, setReposLoaded] = React.useState(false)
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sending, setSending] = useState(false)
    const [toast, setToast] = useState(null)

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
            const p = { from_name: form.name, from_email: form.email, message: form.message, reply_to: form.email }
            await emailjs.send(SERVICE_ID, DEV_TEMPLATE_ID, p, PUBLIC_KEY)
            await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, p, PUBLIC_KEY)
            setForm({ name: '', email: '', message: '' })
            setToast({ type: 'success', msg: '✅ Message sent! I\'ll reply soon.' })
        } catch { setToast({ type: 'error', msg: '❌ Failed to send. Email me directly.' }) }
        setSending(false)
        setTimeout(() => setToast(null), 5000)
    }

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#projects', label: 'Projects' },
        { href: '#resume', label: 'Resume' },
        { href: '#contact', label: 'Contact' },
    ]

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0c2444 50%, #0e3060 100%)' }}>
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 left-4 z-50 py-3 px-4 rounded-xl text-sm font-medium text-white flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-700/90' : 'bg-red-700/90'}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Navbar */}
            <nav className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between"
                style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-xs font-black text-white">DC</div>
                <div className="flex items-center gap-4">
                    {navLinks.map(l => (
                        <a key={l.href} href={l.href} className="text-xs text-gray-400 hover:text-white transition-colors font-medium">{l.label}</a>
                    ))}
                </div>
            </nav>

            {/* Hero */}
            <div className="py-16 px-5 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #5ea2d8)', border: '3px solid rgba(255,255,255,0.2)' }}>DC</div>
                <h1 className="text-4xl font-black text-white mb-2">Divyesh Chauhan</h1>
                <p className="text-blue-300 text-lg">Full Stack Developer</p>
                <div className="flex justify-center gap-3 mt-6">
                    {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="glass-button px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5"><Github size={14} /> GitHub</a>}
                    {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="glass-button px-4 py-2 rounded-lg text-xs text-white flex items-center gap-1.5"><Linkedin size={14} /> LinkedIn</a>}
                </div>
            </div>

            {/* About */}
            <MobileSection id="about" title="About Me">
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{aboutText}</p>
                {(education || []).map((edu, i) => (
                    <div key={i} className="rounded-lg p-4 mb-3 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="font-semibold text-white">{edu.degree}</div>
                        <div className="text-blue-300 text-xs">{edu.institution} · {edu.year}</div>
                    </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-4">
                    {(skills || []).map((s, i) => <span key={i} className="skill-badge">{s}</span>)}
                </div>
            </MobileSection>

            {/* Projects */}
            <MobileSection id="projects" title="Projects">
                {visibleRepos.map(repo => (
                    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                        className="block rounded-lg p-4 mb-3 transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-white">{repo.name}</h3>
                            <ExternalLink size={12} className="text-gray-500" />
                        </div>
                        {repo.description && <p className="text-gray-400 text-xs mb-2">{repo.description}</p>}
                        <div className="flex items-center gap-3">
                            {repo.language && <span className="lang-chip" style={{ background: `${LANG_COLORS[repo.language] || '#888'}22`, color: LANG_COLORS[repo.language] || '#aaa', border: `1px solid ${LANG_COLORS[repo.language] || '#888'}44` }}>{repo.language}</span>}
                            {repo.stargazers_count > 0 && <span className="text-xs text-yellow-400/70 flex items-center gap-1"><Star size={10} fill="currentColor" />{repo.stargazers_count}</span>}
                        </div>
                    </a>
                ))}
            </MobileSection>

            {/* Resume */}
            <MobileSection id="resume" title="Resume">
                <a href={resumeUrl || '#'} target="_blank" rel="noreferrer" download
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white mb-4"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                    <Download size={16} /> Download Resume (PDF)
                </a>
                <div className="flex flex-col gap-2">
                    {socialLinks?.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Github size={18} />GitHub<ExternalLink size={12} className="ml-auto text-gray-500" /></a>}
                    {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white" style={{ background: 'rgba(0,119,181,0.15)', border: '1px solid rgba(0,119,181,0.3)' }}><Linkedin size={18} className="text-blue-400" />LinkedIn<ExternalLink size={12} className="ml-auto text-gray-500" /></a>}
                </div>
            </MobileSection>

            {/* Contact */}
            <MobileSection id="contact" title="Contact">
                <form onSubmit={handleSend} className="flex flex-col gap-3">
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" className="vista-input" required style={{ userSelect: 'text' }} />
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address" className="vista-input" required style={{ userSelect: 'text' }} />
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your message..." rows={5} className="vista-input resize-none" required style={{ userSelect: 'text' }} />
                    <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}>
                        {sending ? <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> : <Send size={15} />}
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </MobileSection>

            <footer className="py-6 text-center text-xs text-gray-600 border-t border-white/5">
                © 2025 Divyesh Chauhan · All rights reserved
            </footer>
        </div>
    )
}
