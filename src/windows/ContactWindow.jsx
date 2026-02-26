import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Send, CheckCircle, XCircle } from 'lucide-react'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const DEV_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_DEV_TEMPLATE_ID || ''
const REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

function Toast({ type, message, onClose }) {
    return (
        <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'} flex items-center gap-3`}>
            {type === 'success' ? <CheckCircle size={18} className="flex-shrink-0" /> : <XCircle size={18} className="flex-shrink-0" />}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white ml-2">✕</button>
        </div>
    )
}

export default function ContactWindow() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 5000)
    }

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.message) {
            showToast('error', 'Please fill in all fields.')
            return
        }
        setLoading(true)

        // Params for dev notification template
        // Template vars: {{name}}, {{userEmail}}, {{time}}, {{message}}, {{email}}
        const devParams = {
            name: form.name,
            userEmail: form.email,
            message: form.message,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            email: 'syncodexide@gmail.com',   // your inbox — fixed recipient
        }
        console.log(devParams);
        // Params for auto-reply template sent to visitor
        // Template vars: {{name}}, {{email}}
        const replyParams = {
            name: form.name,
            email: form.email,   // visitor's email from the form
        }

        try {
            // Send notification to developer
            await emailjs.send(SERVICE_ID, DEV_TEMPLATE_ID, devParams, PUBLIC_KEY)
            // Send auto-reply to visitor
            await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, replyParams, PUBLIC_KEY)
            setForm({ name: '', email: '', message: '' })
            showToast('success', '✅ Message sent! I\'ll get back to you soon.')
        } catch (err) {
            console.error('EmailJS error:', err)
            showToast('error', '❌ Failed to send message. Please email me directly.')
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="h-full overflow-y-auto p-5 text-white" style={{ userSelect: 'text' }}>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className="mb-4">
                <h2 className="text-sm uppercase tracking-widest text-blue-400 font-semibold mb-1">Get in Touch</h2>
                <p className="text-gray-400 text-xs">Fill in the form below and I'll reply as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Your Name</label>
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="vista-input"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="vista-input"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Message</label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Hello Divyesh, I'd like to..."
                        rows={5}
                        className="vista-input resize-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    style={{ background: 'linear-gradient(135deg, #1f72c2, #0d4a8a)', border: '1px solid rgba(94,162,216,0.4)' }}
                >
                    {loading ? (
                        <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                    ) : (
                        <Send size={15} />
                    )}
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>

            {/* Direct email fallback */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500">Or email me directly at</p>
                <a
                    href="mailto:chauhandivyesh313@gmail.com"
                    target="_self"
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open("mailto:chauhandivyesh313@gmail.com", "_self")
                    }}
                    style={{ cursor: 'pointer' }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    chauhandivyesh313@gmail.com
                </a>
            </div>
        </div>
    )
}
