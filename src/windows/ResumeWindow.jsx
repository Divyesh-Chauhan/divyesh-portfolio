import React from 'react'
import { useCmsStore } from '../store/cmsStore'
import { Github, Linkedin, Download, ExternalLink } from 'lucide-react'

export default function ResumeWindow() {
    const { resumeUrl, socialLinks } = useCmsStore()

    return (
        <div className="h-full overflow-y-auto p-5 text-white flex flex-col gap-4">
            {/* Header */}
            <div className="text-center py-4">
                <div className="text-5xl mb-2">📄</div>
                <h1 className="text-xl font-bold text-white">Divyesh Chauhan</h1>
                <p className="text-blue-300 text-sm mt-1">Full Stack Developer</p>
            </div>

            {/* Download Resume */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(31,114,194,0.15)', border: '1px solid rgba(94,162,216,0.3)' }}>
                <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3">Resume</h2>
                <a
                    href={resumeUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm text-white transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}
                >
                    <Download size={16} />
                    Download Resume (PDF)
                </a>
            </div>

            {/* Social Links */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3">Social Links</h2>
                <div className="flex flex-col gap-2.5">
                    {socialLinks?.github && (
                        <a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <Github size={18} />
                            <span className="flex-1">GitHub</span>
                            <ExternalLink size={13} className="text-gray-500" />
                        </a>
                    )}
                    {socialLinks?.linkedin && (
                        <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-900/40"
                            style={{ background: 'rgba(0,119,181,0.15)', border: '1px solid rgba(0,119,181,0.3)' }}
                        >
                            <Linkedin size={18} className="text-blue-400" />
                            <span className="flex-1">LinkedIn</span>
                            <ExternalLink size={13} className="text-gray-500" />
                        </a>
                    )}
                </div>
            </div>

            {/* Contact shortcut */}
            <div className="text-center text-gray-500 text-xs">
                <p>✉️ syncodexide@gmail.com</p>
                <p className="mt-1">Open the Contact window to send a message</p>
            </div>
        </div>
    )
}
