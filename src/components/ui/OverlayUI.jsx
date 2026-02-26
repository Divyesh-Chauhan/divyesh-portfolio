import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, FileText } from 'lucide-react'
import useStore from '../../store/useStore'
import ContactForm from './ContactForm'

export default function OverlayUI() {
    const activeUI = useStore(state => state.activeUI)
    const setActiveUI = useStore(state => state.setActiveUI)
    const content = useStore(state => state.content)
    const activeItem = useStore(state => state.activeItem)

    const handleClose = () => setActiveUI(null)

    // Sub-components for different sections
    const AboutPanel = () => (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="glass-panel p-8 max-w-2xl w-full rounded-lg border border-pirate-gold pirate-scroll overflow-y-auto max-h-[80vh]"
        >
            <div className="flex justify-between items-start mb-6 border-b border-pirate-wood pb-4">
                <h2 className="text-4xl font-pirate text-pirate-gold shadow-black drop-shadow-md">About Me</h2>
                <button onClick={handleClose} className="text-pirate-paper hover:text-red-500 text-2xl">✕</button>
            </div>
            <div className="space-y-6 font-body text-gray-200 text-lg leading-relaxed">
                <section>
                    <h3 className="text-xl text-pirate-primary font-pirate mb-2">Bio</h3>
                    <p>{content.about.bio}</p>
                </section>
                <section>
                    <h3 className="text-xl text-pirate-primary font-pirate mb-2">Education</h3>
                    <p>{content.about.education}</p>
                </section>
                <section>
                    <h3 className="text-xl text-pirate-primary font-pirate mb-2">Goals</h3>
                    <p>{content.about.goals}</p>
                </section>
            </div>
        </motion.div>
    )

    const SkillsPanel = () => (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel p-8 max-w-4xl w-full rounded-lg border-2 border-[#1a1c29] bg-gradient-to-br from-[#1a1c29]/90 to-pirate-bg shadow-2xl"
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-pirate text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">Devil Fruit Lab: Skills</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pirate-scroll overflow-y-auto max-h-[60vh] p-2">
                {content.skills.map((skill) => (
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(244, 162, 97, 0.5)" }}
                        key={skill.id}
                        className="bg-black/40 border border-pirate-wood rounded p-6 flex flex-col items-center text-center cursor-default group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pirate-primary to-purple-600 mb-4 flex items-center justify-center text-2xl shadow-lg group-hover:animate-pulse">
                            🍎
                        </div>
                        <h3 className="text-xl font-pirate text-pirate-gold mb-2">{skill.name}</h3>
                        <span className="text-xs font-bold px-2 py-1 bg-pirate-wood rounded text-pirate-paper mb-3">{skill.level}</span>
                        <p className="text-sm font-body text-gray-400">{skill.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )

    const ProjectsPanel = () => (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="bg-[#d4b483] bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] text-[#3e2723] p-8 max-w-5xl w-full rounded-sm shadow-[10px_10px_0_rgba(0,0,0,0.5)] border-4 border-[#8b5a2b] relative"
        >
            <div className="flex justify-between items-center mb-8 border-b-2 border-[#8b5a2b] pb-4">
                <h2 className="text-5xl font-pirate text-[#4a3018] tracking-widest uppercase">Wanted Bounties <br /><span className="text-2xl">(Projects)</span></h2>
                <button onClick={handleClose} className="text-[#8b5a2b] hover:text-red-800 text-3xl font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pirate-scroll overflow-y-auto max-h-[60vh] p-4">
                {content.projects.map((project) => (
                    <div key={project.id} className="bg-[#fefae0] border border-[#d4b483] p-4 shadow-[5px_5px_15px_rgba(0,0,0,0.2)] flex flex-col items-center">
                        <div className="w-full h-40 bg-[#3e2723] mb-4 flex items-center justify-center text-[#d4b483]">
                            [Project Image]
                        </div>
                        <h3 className="text-3xl font-pirate text-center mb-2">{project.title}</h3>
                        <p className="font-body text-center text-sm mb-4 opacity-80 flex-grow">{project.description}</p>

                        <div className="w-full flex flex-wrap gap-2 mb-4 justify-center">
                            {project.tech.map(t => <span key={t} className="text-xs bg-[#8b5a2b] text-white px-2 py-1 rounded">{t}</span>)}
                        </div>

                        <div className="flex w-full gap-2 mt-auto">
                            {project.github && project.github !== '#' && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 text-center bg-[#3e2723] text-white py-2 font-pirate hover:bg-black transition-colors">Code</a>
                            )}
                            {project.live && project.live !== '#' && (
                                <a href={project.live} target="_blank" rel="noreferrer" className="flex-1 text-center bg-pirate-primary text-white py-2 font-pirate hover:bg-red-700 transition-colors">Live</a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )

    const MarinePanel = () => (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white text-blue-900 border-8 border-blue-900 p-8 max-w-md w-full relative shadow-2xl"
        >
            <div className="flex justify-between items-center mb-8 border-b-2 border-blue-900 pb-2">
                <h2 className="text-3xl font-pirate uppercase font-bold text-blue-900">Marine HQ</h2>
                <button onClick={handleClose} className="text-blue-900 hover:text-red-600 text-2xl font-bold">✕</button>
            </div>

            <p className="font-body mb-8 text-center text-gray-700">Official documents and communication links for Divyesh Chauhan.</p>

            <div className="flex flex-col gap-4">
                {content.socials.resume && content.socials.resume !== '#' && (
                    <a href={content.socials.resume} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-blue-900 text-white p-4 font-pirate text-xl hover:bg-blue-800 transition-colors">
                        <FileText /> Download Resume
                    </a>
                )}
                {content.socials.github && content.socials.github !== '#' && (
                    <a href={content.socials.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-gray-900 text-white p-4 font-pirate text-xl hover:bg-black transition-colors">
                        <Github /> GitHub
                    </a>
                )}
                {content.socials.linkedin && content.socials.linkedin !== '#' && (
                    <a href={content.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#0a66c2] text-white p-4 font-pirate text-xl hover:bg-blue-700 transition-colors">
                        <Linkedin /> LinkedIn
                    </a>
                )}
            </div>
        </motion.div>
    )

    return (
        <AnimatePresence>
            {activeUI && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
                    {activeUI === 'about' && <AboutPanel />}
                    {activeUI === 'skills' && <SkillsPanel />}
                    {activeUI === 'projects' && <ProjectsPanel />}
                    {activeUI === 'contact' && <ContactForm onClose={handleClose} />}
                    {activeUI === 'marine' && <MarinePanel />}
                </div>
            )}
        </AnimatePresence>
    )
}
