import { create } from 'zustand'

const STORAGE_KEY = 'portfolio_cms_v1'

const defaultData = {
    aboutText: `Hi! I'm Divyesh Chauhan, a passionate full-stack developer who loves building beautiful, functional web applications. I specialize in React, Node.js, and modern web technologies. I'm always eager to learn new skills and take on challenging projects.`,
    avatarUrl: '',   // URL to profile image (or empty for initials fallback)
    education: [
        { degree: 'B.Tech in Computer Science', institution: 'Your University', year: '2023-2027' },
    ],
    skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
        'MongoDB', 'PostgreSQL', 'HTML/CSS', 'Tailwind CSS', 'Git',
        'Vite', 'REST APIs', 'Next.js', 'Python', 'Docker'
    ],
    githubUsername: 'divyesh-chauhan',
    socialLinks: {
        github: 'https://github.com/divyesh-chauhan',
        linkedin: 'https://linkedin.com/in/divyesh-chauhan',
    },
    resumeUrl: '/Resume_Divyesh_Chauhan.pdf',
    repoVisibility: {},
    liveLinks: {},
    blogs: [],       // [{ id, title, date, tags, content }]
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) return { ...defaultData, ...JSON.parse(stored) }
    } catch (e) { /* ignore */ }
    return defaultData
}

function saveToStorage(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch (e) { }
}

const ALL_KEYS = ['aboutText', 'avatarUrl', 'education', 'skills', 'githubUsername',
    'socialLinks', 'resumeUrl', 'repoVisibility', 'liveLinks', 'blogs']

export const useCmsStore = create((set, get) => ({
    ...loadFromStorage(),

    update: (patch) => set((state) => {
        const next = { ...state, ...patch }
        const toSave = {}
        ALL_KEYS.forEach(k => { toSave[k] = next[k] })
        saveToStorage(toSave)
        return next
    }),

    setRepoVisibility: (repoName, visible) => set((state) => {
        const repoVisibility = { ...state.repoVisibility, [repoName]: visible }
        const next = { ...state, repoVisibility }
        const toSave = {}
        ALL_KEYS.forEach(k => { toSave[k] = next[k] })
        saveToStorage(toSave)
        return { repoVisibility }
    }),

    reset: () => set(() => {
        localStorage.removeItem(STORAGE_KEY)
        return { ...defaultData }
    }),
}))
