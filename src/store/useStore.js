import { create } from 'zustand'

const DEFAULT_CONTENT = {
  about: {
    bio: "I'm Divyesh Chauhan, a creative Full Stack Developer focused on the MERN stack. I build robust web apps with a unique twist.",
    education: "B.Tech in Computer Science",
    goals: "To become a world-class creative developer."
  },
  skills: [
    { id: 'react', name: 'React', level: 'Advanced', description: 'Building interactive UIs' },
    { id: 'node', name: 'Node.js', level: 'Intermediate', description: 'Backend APIs and services' },
    { id: 'mongodb', name: 'MongoDB', level: 'Intermediate', description: 'NoSQL Database management' },
    { id: 'express', name: 'Express', level: 'Intermediate', description: 'Server framework for Node.js' },
    { id: 'javascript', name: 'JavaScript', level: 'Advanced', description: 'Core language for everything' },
    { id: 'git', name: 'Git', level: 'Advanced', description: 'Version control' }
  ],
  projects: [
    {
      id: 1,
      title: 'Pirate E-Commerce',
      description: 'A full-stack store selling fictional pirate gear.',
      tech: ['React', 'Node', 'MongoDB'],
      github: 'https://github.com/Divyesh-Chauhan',
      live: '#'
    }
  ],
  socials: {
    resume: '#',
    github: 'https://github.com/Divyesh-Chauhan',
    linkedin: '#'
  }
}

const loadContent = () => {
  const saved = localStorage.getItem('pirate_portfolio_cms')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return DEFAULT_CONTENT
    }
  }
  return DEFAULT_CONTENT
}

const useStore = create((set) => ({
  content: loadContent(),
  activeUI: null, // "dock", "about", "skills", "projects", "contact", "marine"
  activeItem: null, // e.g., the specific skill or project object to show
  isAdminAuthenticated: false,

  setContent: (newContent) => set((state) => {
    const updated = { ...state.content, ...newContent }
    localStorage.setItem('pirate_portfolio_cms', JSON.stringify(updated))
    return { content: updated }
  }),

  setActiveUI: (ui, item = null) => set({ activeUI: ui, activeItem: item }),

  loginAdmin: (email, password) => {
    if (email === 'admin@portfolio.dev' && password === 'Divuu@2005#15!Chau') {
      set({ isAdminAuthenticated: true })
      return true
    }
    return false
  },

  logoutAdmin: () => set({ isAdminAuthenticated: false })
}))

export default useStore
