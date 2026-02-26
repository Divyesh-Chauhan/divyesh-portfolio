import { create } from 'zustand'

let zCounter = 100

export const useWindowStore = create((set, get) => ({
    windows: {
        about: { id: 'about', title: 'About Me', icon: '👤', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 80, y: 60, width: 680, height: 520 },
        projects: { id: 'projects', title: 'My Projects', icon: '💼', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 160, y: 80, width: 760, height: 560 },
        resume: { id: 'resume', title: 'Resume & Links', icon: '📄', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 220, y: 100, width: 500, height: 420 },
        contact: { id: 'contact', title: 'Contact Me', icon: '✉️', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 300, y: 70, width: 520, height: 480 },
        snake: { id: 'snake', title: 'Snake', icon: '🐍', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 200, y: 40, width: 440, height: 480 },
        minesweeper: { id: 'minesweeper', title: 'Minesweeper', icon: '💣', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 250, y: 50, width: 380, height: 440 },
        tictactoe: { id: 'tictactoe', title: 'Tic-Tac-Toe', icon: '❌', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 300, y: 60, width: 340, height: 430 },
        blog: { id: 'blog', title: 'Blog', icon: '📝', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100, x: 180, y: 55, width: 640, height: 540 },
    },

    openWindow: (id) => set((state) => {
        zCounter++
        const win = state.windows[id]
        return {
            windows: {
                ...state.windows,
                [id]: { ...win, isOpen: true, isMinimized: false, zIndex: zCounter }
            }
        }
    }),

    closeWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isOpen: false, isMinimized: false, isMaximized: false }
        }
    })),

    minimizeWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMinimized: true }
        }
    })),

    maximizeWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized }
        }
    })),

    focusWindow: (id) => set((state) => {
        zCounter++
        return {
            windows: {
                ...state.windows,
                [id]: { ...state.windows[id], isMinimized: false, zIndex: zCounter }
            }
        }
    }),

    updatePosition: (id, x, y) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], x, y }
        }
    })),
}))
