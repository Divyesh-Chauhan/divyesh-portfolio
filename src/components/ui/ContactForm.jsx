import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'

export default function ContactForm({ onClose }) {
    const form = useRef()
    const [status, setStatus] = useState('idle') // idle, sending, success, error

    const sendEmail = (e) => {
        e.preventDefault()
        setStatus('sending')

        // Normally read these from Vite env variables
        // For portfolio context, you need to set up free EmailJS
        // And provide SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder'
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder'
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder'

        emailjs
            .sendForm(serviceId, templateId, form.current, {
                publicKey: publicKey,
            })
            .then(
                () => {
                    setStatus('success')
                    setTimeout(() => {
                        onClose()
                    }, 2000)
                },
                (error) => {
                    console.error('FAILED...', error.text)
                    setStatus('error')
                },
            )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel p-8 max-w-md w-full rounded-lg border-2 border-pirate-gold relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pirate-primary to-pirate-gold"></div>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-pirate-paper hover:text-pirate-primary"
            >
                ✕
            </button>

            <h2 className="text-3xl font-pirate text-pirate-gold mb-6 border-b border-pirate-wood pb-2">Send a Message</h2>

            {status === 'success' ? (
                <div className="text-center p-8">
                    <div className="text-5xl mb-4">🕊️</div>
                    <h3 className="text-xl font-pirate text-green-400 mb-2">Message Sent!</h3>
                    <p className="text-gray-300 font-body">I will reply via Den Den Mushi shortly.</p>
                </div>
            ) : (
                <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4 font-body">
                    <div>
                        <label className="block text-pirate-gold mb-1">Name</label>
                        <input
                            type="text"
                            name="user_name"
                            required
                            className="w-full bg-black/40 border border-pirate-wood rounded p-2 text-pirate-paper focus:border-pirate-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-pirate-gold mb-1">Email</label>
                        <input
                            type="email"
                            name="user_email"
                            required
                            className="w-full bg-black/40 border border-pirate-wood rounded p-2 text-pirate-paper focus:border-pirate-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-pirate-gold mb-1">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={4}
                            className="w-full bg-black/40 border border-pirate-wood rounded p-2 text-pirate-paper focus:border-pirate-primary outline-none resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="mt-4 bg-pirate-wood hover:bg-pirate-primary text-white font-pirate py-3 rounded transition-colors border border-pirate-gold disabled:opacity-50"
                    >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status === 'error' && (
                        <p className="text-red-400 text-sm text-center">Failed to send. The birds are asleep.</p>
                    )}
                </form>
            )}
        </motion.div>
    )
}
