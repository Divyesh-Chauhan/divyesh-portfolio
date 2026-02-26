import React from 'react'
import { useCmsStore } from '../store/cmsStore'

export default function AboutWindow() {
    const { aboutText, avatarUrl, education, skills } = useCmsStore()

    return (
        <div className="h-full overflow-y-auto p-5 text-white" style={{ userSelect: 'text' }}>
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-5">
                {/* Avatar — image if URL set, else initials */}
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        style={{
                            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                            objectFit: 'cover',
                            border: '2px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                ) : null}
                <div
                    className="flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-lg"
                    style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1f72c2, #5ea2d8)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        display: avatarUrl ? 'none' : 'flex',
                    }}
                >
                    DC
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Divyesh Chauhan</h1>
                    <p className="text-blue-300 text-sm">Full Stack Developer</p>
                    <p className="text-gray-400 text-xs mt-0.5">📍 India</p>
                </div>
            </div>

            {/* Bio */}
            <section className="mb-5">
                <SectionTitle>About</SectionTitle>
                <p className="text-gray-300 text-sm leading-relaxed">{aboutText}</p>
            </section>

            {/* Education */}
            {(education || []).length > 0 && (
                <section className="mb-5">
                    <SectionTitle>Education</SectionTitle>
                    <div className="flex flex-col gap-2">
                        {education.map((edu, i) => (
                            <div key={i} className="rounded-lg p-3 text-sm"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="font-semibold text-white">{edu.degree}</div>
                                <div className="text-blue-300">{edu.institution}</div>
                                {edu.year && <div className="text-gray-500 text-xs mt-0.5">{edu.year}</div>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {(skills || []).length > 0 && (
                <section>
                    <SectionTitle>Skills &amp; Technologies</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <span key={i} className="skill-badge">{skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

function SectionTitle({ children }) {
    return (
        <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-blue-500 inline-block" />
            {children}
        </h2>
    )
}
