import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCmsStore } from '../store/cmsStore'
import { LogOut, Save, RefreshCw, Github, ExternalLink, Eye, EyeOff } from 'lucide-react'

function Section({ title, icon, children }) {
    return (
        <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-sm font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <span>{icon}</span>{title}
            </h2>
            {children}
        </div>
    )
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const cms = useCmsStore()
    const [saved, setSaved] = useState(false)

    // Local form state
    const [aboutText, setAboutText] = useState(cms.aboutText)
    const [avatarUrl, setAvatarUrl] = useState(cms.avatarUrl || '')
    const [education, setEducation] = useState(cms.education || [])
    const [blogs, setBlogs] = useState(cms.blogs || [])
    const [skillsStr, setSkillsStr] = useState((cms.skills || []).join(', '))
    const [githubUsername, setGithubUsername] = useState(cms.githubUsername)
    const [githubLink, setGithubLink] = useState(cms.socialLinks?.github || '')
    const [linkedinLink, setLinkedinLink] = useState(cms.socialLinks?.linkedin || '')
    const [resumeUrl, setResumeUrl] = useState(cms.resumeUrl)
    const [repos, setRepos] = useState([])
    const [repoLoading, setRepoLoading] = useState(false)
    const [repoError, setRepoError] = useState('')
    const [repoVisibility, setRepoVisibility] = useState(cms.repoVisibility || {})
    const [liveLinks, setLiveLinks] = useState(cms.liveLinks || {})
    // Blog compose state
    const [blogTitle, setBlogTitle] = useState('')
    const [blogContent, setBlogContent] = useState('')
    const [blogTags, setBlogTags] = useState('')

    // Protect route
    useEffect(() => {
        if (sessionStorage.getItem('admin_auth') !== 'true') {
            navigate('/control-panel')
        }
    }, [])

    // Fetch repos when username changes
    const fetchRepos = () => {
        if (!githubUsername) return
        setRepoLoading(true)
        setRepoError('')
        fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
            .then(r => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json() })
            .then(data => { setRepos(data); setRepoLoading(false) })
            .catch(e => { setRepoError(e.message); setRepoLoading(false) })
    }

    useEffect(() => { fetchRepos() }, [])

    const toggleVisibility = (name) => {
        setRepoVisibility(prev => ({ ...prev, [name]: !(prev[name] === undefined ? true : prev[name]) }))
    }

    const isVisible = (name) => {
        const v = repoVisibility[name]
        return v === undefined ? true : v
    }

    const handleSave = () => {
        const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean)
        cms.update({
            aboutText,
            avatarUrl,
            education,
            blogs,
            skills,
            githubUsername,
            socialLinks: { github: githubLink, linkedin: linkedinLink },
            resumeUrl,
            repoVisibility,
            liveLinks,
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth')
        navigate('/control-panel')
    }

    return (
        <div className="text-white"
            style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0c2444 60%, #0e3060 100%)', height: '100vh', overflowY: 'auto' }}>

            {/* Top nav */}
            <div className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
                style={{ background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-xs font-black">DC</div>
                    <h1 className="text-sm font-bold text-white">Admin Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    {saved && <span className="text-green-400 text-xs font-medium animate-pulse">✓ Saved!</span>}
                    <a href="/" className="text-xs text-blue-400 hover:text-white transition-colors flex items-center gap-1">
                        <ExternalLink size={12} /> View Site
                    </a>
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors ml-2">
                        <LogOut size={13} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 flex flex-col gap-5">

                {/* About */}
                <Section title="About Me" icon="👤">
                    <label className="block text-xs text-gray-400 mb-1.5">Bio Text</label>
                    <textarea
                        value={aboutText}
                        onChange={e => setAboutText(e.target.value)}
                        rows={5}
                        className="vista-input resize-y"
                        placeholder="Write your bio..."
                    />
                </Section>

                {/* Profile Image */}
                <Section title="Profile Image" icon="🖼️">
                    <label className="block text-xs text-gray-400 mb-1.5">Image URL (paste a direct image link)</label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={e => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/my-photo.jpg"
                            className="vista-input flex-1"
                        />
                        {avatarUrl && (
                            <img
                                src={avatarUrl}
                                alt="Preview"
                                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }}
                                onError={e => e.target.style.display = 'none'}
                            />
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Leave blank to show the "DC" initials avatar.</p>
                </Section>

                {/* Education */}
                <Section title="Education" icon="🎓">
                    <div className="flex flex-col gap-2 mb-3">
                        {education.map((edu, i) => (
                            <div key={i} className="rounded-lg p-3 flex flex-col gap-2"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="flex gap-2">
                                    <input
                                        value={edu.degree}
                                        onChange={e => setEducation(prev => prev.map((d, j) => j === i ? { ...d, degree: e.target.value } : d))}
                                        placeholder="Degree / Course"
                                        className="vista-input flex-1"
                                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                                    />
                                    <button
                                        onClick={() => setEducation(prev => prev.filter((_, j) => j !== i))}
                                        className="text-red-400 hover:text-red-300 text-sm px-2 flex-shrink-0"
                                        title="Remove"
                                    >✕</button>
                                </div>
                                <input
                                    value={edu.institution}
                                    onChange={e => setEducation(prev => prev.map((d, j) => j === i ? { ...d, institution: e.target.value } : d))}
                                    placeholder="Institution / University"
                                    className="vista-input"
                                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                                />
                                <input
                                    value={edu.year}
                                    onChange={e => setEducation(prev => prev.map((d, j) => j === i ? { ...d, year: e.target.value } : d))}
                                    placeholder="Year (e.g. 2021-2025)"
                                    className="vista-input"
                                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setEducation(prev => [...prev, { degree: '', institution: '', year: '' }])}
                        className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >+ Add Education Entry</button>
                </Section>

                {/* Blog posts */}
                <Section title="Blog Posts" icon="📝">
                    {/* Compose */}
                    <div className="rounded-lg p-4 mb-4 flex flex-col gap-2.5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-xs text-blue-300 font-semibold mb-0.5">Write a new post</p>
                        <input
                            value={blogTitle}
                            onChange={e => setBlogTitle(e.target.value)}
                            placeholder="Post title"
                            className="vista-input"
                        />
                        <textarea
                            value={blogContent}
                            onChange={e => setBlogContent(e.target.value)}
                            rows={6}
                            className="vista-input resize-y font-mono"
                            placeholder={"# Heading\n\nWrite your content here...\n\nSupports **bold**, *italic*, and --- dividers."}
                            style={{ fontSize: '0.78rem' }}
                        />
                        <input
                            value={blogTags}
                            onChange={e => setBlogTags(e.target.value)}
                            placeholder="Tags (comma-separated, e.g. React, Tutorial)"
                            className="vista-input"
                            style={{ fontSize: '0.78rem' }}
                        />
                        <button
                            onClick={() => {
                                if (!blogTitle.trim() || !blogContent.trim()) return
                                const post = {
                                    id: Date.now().toString(),
                                    title: blogTitle.trim(),
                                    content: blogContent,
                                    date: new Date().toISOString(),
                                    tags: blogTags.split(',').map(t => t.trim()).filter(Boolean),
                                }
                                setBlogs(prev => [post, ...prev])
                                setBlogTitle(''); setBlogContent(''); setBlogTags('')
                            }}
                            className="self-start flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg,#1f72c2,#0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}
                        >📤 Publish Post</button>
                    </div>

                    {/* Existing posts */}
                    {blogs.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            <p className="text-xs text-gray-400 mb-1">{blogs.length} published post{blogs.length !== 1 ? 's' : ''}:</p>
                            {[...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)).map(post => (
                                <div key={post.id} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-medium truncate">{post.title}</p>
                                        <p className="text-gray-500 text-[10px]">
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            {post.tags?.length > 0 && ` · ${post.tags.join(', ')}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setBlogs(prev => prev.filter(b => b.id !== post.id))}
                                        className="text-red-400 hover:text-red-300 text-sm px-1 flex-shrink-0"
                                        title="Delete"
                                    >🗑️</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {blogs.length === 0 && (
                        <p className="text-xs text-gray-500 italic">No posts yet — write one above and hit Publish.</p>
                    )}
                </Section>

                {/* Skills */}
                <Section title="Skills" icon="⚡">
                    <label className="block text-xs text-gray-400 mb-1.5">Skills (comma-separated)</label>
                    <textarea
                        value={skillsStr}
                        onChange={e => setSkillsStr(e.target.value)}
                        rows={3}
                        className="vista-input resize-none"
                        placeholder="React, Node.js, Python, ..."
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Each skill will appear as a badge on the About window.</p>
                </Section>

                {/* GitHub */}
                <Section title="GitHub Integration" icon="🐙">
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={githubUsername}
                            onChange={e => setGithubUsername(e.target.value)}
                            placeholder="GitHub username"
                            className="vista-input flex-1"
                        />
                        <button
                            onClick={fetchRepos}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110 flex-shrink-0"
                            style={{ background: 'rgba(31,114,194,0.5)', border: '1px solid rgba(94,162,216,0.4)' }}
                        >
                            <RefreshCw size={13} /> Fetch
                        </button>
                    </div>

                    {repoLoading && <p className="text-xs text-gray-400 animate-pulse">Loading repositories...</p>}
                    {repoError && <p className="text-xs text-red-400">Error: {repoError}</p>}

                    {repos.length > 0 && (
                        <div className="mt-2 max-h-96 overflow-y-auto flex flex-col gap-1.5 pr-1">
                            <p className="text-xs text-gray-400 mb-1">{repos.length} repos — toggle visibility & add live URL:</p>
                            {repos.map(repo => (
                                <div key={repo.id}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>

                                    {/* Repo name + language */}
                                    <div className="min-w-0" style={{ width: 110, flexShrink: 0 }}>
                                        <p className="text-white text-xs font-medium truncate">{repo.name}</p>
                                        {repo.language && <p className="text-gray-500 text-[10px] truncate">{repo.language}</p>}
                                    </div>

                                    {/* Live URL input — inline */}
                                    <input
                                        type="url"
                                        value={liveLinks[repo.name] || ''}
                                        onChange={e => setLiveLinks(prev => ({ ...prev, [repo.name]: e.target.value }))}
                                        placeholder="https://live-url.com"
                                        className="vista-input flex-1 min-w-0"
                                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                                    />

                                    {/* Toggle */}
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isVisible(repo.name)}
                                            onChange={() => toggleVisibility(repo.name)}
                                            className="sr-only"
                                        />
                                        <div className="w-10 h-5 rounded-full transition-colors relative"
                                            style={{
                                                background: isVisible(repo.name) ? 'rgba(31,114,194,0.7)' : 'rgba(255,255,255,0.1)',
                                                border: `1px solid ${isVisible(repo.name) ? 'rgba(94,162,216,0.8)' : 'rgba(255,255,255,0.2)'}`
                                            }}>
                                            <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                                                style={{ left: isVisible(repo.name) ? '20px' : '2px' }} />
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* ── Live Project Links (standalone) ───────────────────── */}
                <Section title="Live Project Links" icon="🌐">
                    <p className="text-xs text-gray-500 mb-3">
                        Enter the GitHub repo name and its live demo URL. These show as "Live Demo" buttons on project cards.
                    </p>
                    <div className="flex flex-col gap-2">
                        {Object.entries({ ...liveLinks, __new__: '' }).map(([key, val], idx, arr) => {
                            const isNew = key === '__new__'
                            return (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={isNew ? '' : key}
                                        readOnly={!isNew}
                                        placeholder="repo-name (e.g. my-portfolio)"
                                        className="vista-input flex-1"
                                        style={{ fontSize: '0.75rem' }}
                                        onBlur={e => {
                                            if (!isNew) return
                                            const name = e.target.value.trim()
                                            if (name) setLiveLinks(prev => ({ ...prev, [name]: '' }))
                                        }}
                                    />
                                    <input
                                        type="url"
                                        value={isNew ? '' : val}
                                        readOnly={isNew}
                                        placeholder={isNew ? 'URL auto-set after naming' : 'https://live-url.com'}
                                        className="vista-input flex-1"
                                        style={{ fontSize: '0.75rem' }}
                                        onChange={e => {
                                            if (isNew) return
                                            setLiveLinks(prev => ({ ...prev, [key]: e.target.value }))
                                        }}
                                    />
                                    {!isNew && (
                                        <button
                                            type="button"
                                            onClick={() => setLiveLinks(prev => { const n = { ...prev }; delete n[key]; return n })}
                                            className="text-red-400 hover:text-red-300 text-base flex-shrink-0 px-1"
                                            title="Remove"
                                        >✕</button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const name = prompt('Enter exact GitHub repo name:')
                            if (name && name.trim()) setLiveLinks(prev => ({ ...prev, [name.trim()]: '' }))
                        }}
                        className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        + Add Live Link
                    </button>
                </Section>

                {/* Social Links */}

                <Section title="Social Links" icon="🔗">
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">GitHub URL</label>
                            <input
                                type="url"
                                value={githubLink}
                                onChange={e => setGithubLink(e.target.value)}
                                placeholder="https://github.com/username"
                                className="vista-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">LinkedIn URL</label>
                            <input
                                type="url"
                                value={linkedinLink}
                                onChange={e => setLinkedinLink(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                className="vista-input"
                            />
                        </div>
                    </div>
                </Section>

                {/* Resume */}
                <Section title="Resume" icon="📄">
                    <label className="block text-xs text-gray-400 mb-1.5">Resume Download URL or Path</label>
                    <input
                        type="text"
                        value={resumeUrl}
                        onChange={e => setResumeUrl(e.target.value)}
                        placeholder="/Resume_Divyesh_Chauhan.pdf or https://..."
                        className="vista-input"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Place the PDF in the <code className="text-blue-400">/public</code> folder and reference it as <code className="text-blue-400">/filename.pdf</code></p>
                </Section>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:brightness-110 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}
                >
                    <Save size={16} />
                    Save All Changes
                </button>
            </div>
        </div>
    )
}
