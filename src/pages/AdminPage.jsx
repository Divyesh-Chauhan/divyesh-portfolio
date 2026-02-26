import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

export default function AdminPage() {
    const isAdminAuthenticated = useStore(state => state.isAdminAuthenticated)
    const loginAdmin = useStore(state => state.loginAdmin)
    const logoutAdmin = useStore(state => state.logoutAdmin)
    const content = useStore(state => state.content)
    const setContent = useStore(state => state.setContent)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(content))) // Deep copy
    const [successMsg, setSuccessMsg] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()
        if (loginAdmin(email, password)) {
            setError('')
        } else {
            setError('Invalid credentials.')
        }
    }

    const handleSave = (e) => {
        e.preventDefault()
        setContent(formData)
        setSuccessMsg('Changes saved to Log Pose (Local Storage)!')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    if (!isAdminAuthenticated) {
        return (
            <div className="w-full h-screen bg-pirate-bg flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="glass-panel p-8 rounded-lg max-w-sm w-full border border-pirate-gold">
                    <h2 className="text-3xl text-pirate-gold font-pirate mb-6 text-center">Grand Line Admin</h2>
                    {error && <p className="text-red-500 mb-4 text-center font-body">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-pirate-paper mb-2 font-body">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 bg-black/50 border border-pirate-wood text-white rounded outline-none focus:border-pirate-primary"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-pirate-paper mb-2 font-body">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 bg-black/50 border border-pirate-wood text-white rounded outline-none focus:border-pirate-primary"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-pirate-primary hover:bg-red-800 text-white font-pirate py-2 rounded transition-colors border border-pirate-gold">
                        Login
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-pirate-bg text-pirate-paper p-8 overflow-y-auto pirate-scroll font-body">
            <div className="max-w-4xl mx-auto glass-panel p-8 rounded-lg border border-pirate-gold">
                <div className="flex justify-between items-center mb-8 border-b border-pirate-wood pb-4">
                    <h1 className="text-4xl font-pirate text-pirate-gold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-blue-400 hover:text-blue-300 underline font-pirate">View World</a>
                        <button onClick={logoutAdmin} className="bg-red-600 px-4 py-2 rounded text-white font-pirate border border-pirate-gold">Logout</button>
                    </div>
                </div>

                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-600/20 border border-green-500 text-green-400 p-4 rounded mb-6 text-center"
                    >
                        {successMsg}
                    </motion.div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    {/* About Section */}
                    <section className="bg-black/30 p-6 rounded border border-pirate-wood">
                        <h2 className="text-2xl font-pirate text-pirate-primary mb-4">About Me</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-pirate-gold">Bio</label>
                                <textarea
                                    value={formData.about.bio}
                                    onChange={(e) => handleChange('about', 'bio', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white min-h-[100px]"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-pirate-gold">Education</label>
                                <input
                                    value={formData.about.education}
                                    onChange={(e) => handleChange('about', 'education', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-pirate-gold">Goals</label>
                                <input
                                    value={formData.about.goals}
                                    onChange={(e) => handleChange('about', 'goals', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Socials Section */}
                    <section className="bg-black/30 p-6 rounded border border-pirate-wood">
                        <h2 className="text-2xl font-pirate text-pirate-primary mb-4">Marine HQ Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-pirate-gold">Resume URL</label>
                                <input
                                    value={formData.socials.resume}
                                    onChange={(e) => handleChange('socials', 'resume', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-pirate-gold">GitHub URL</label>
                                <input
                                    value={formData.socials.github}
                                    onChange={(e) => handleChange('socials', 'github', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-pirate-gold">LinkedIn URL</label>
                                <input
                                    value={formData.socials.linkedin}
                                    onChange={(e) => handleChange('socials', 'linkedin', e.target.value)}
                                    className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded text-yellow-300 text-sm">
                        Note: Skills and Projects arrays are simplified here for the demo. In a full app, you'd add dynamic array fields.
                        Currently edits About and Links.
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 text-xl bg-pirate-wood hover:bg-pirate-primary text-white font-pirate rounded transition-colors border-2 border-pirate-gold"
                    >
                        Save Changes to LocalStorage
                    </button>
                </form>
            </div>
        </div>
    )
}
