import { useState, useEffect, useMemo } from 'react'

const CV_FILENAME = 'resume.pdf'
const CV_URL = `${import.meta.env.BASE_URL}cv/${CV_FILENAME}`

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'HTML', 'CSS',
  'Tailwind CSS', 'Node.js', 'Git', 'REST APIs', 'SQL', 'Vite',
  'C/C++', 'Problem Solving',
]

const PROJECTS = [
  {
    title: 'Desktop AI — Luna',
    description: 'Voice-controlled desktop AI that takes commands to perform tasks. Built with Python.',
    tech: ['Python', 'AI', 'Voice'],
    link: 'https://github.com/Divyesh-Chauhan/Desktop-Ai-Luna',
  },
  {
    title: 'ClipForge',
    description: 'Trim long videos into 30 or 60 second clips for YouTube Shorts, Instagram Reels, and more.',
    tech: ['Python', 'Video', 'FFmpeg'],
    link: 'https://github.com/Divyesh-Chauhan/ClipForge',
  },
]

const TYPING_LINES = [
  'const name = "Divyesh Chauhan";',
  'const role = "Web Developer & Programmer";',
  'const education = "GTU · Computer Engineering";',
]

const BG_SYMBOLS = ['</>', '{}', '()', '=>', '<>', '[]', '#', '/*', '*/', 'const', 'fn', 'def', 'return', 'import', 'JS', 'TS', 'PY', 'HTML', 'CSS', '{}', '()', '=>', '</>', '<>', '[]']

function BackgroundSymbols() {
  const symbols = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      text: BG_SYMBOLS[i % BG_SYMBOLS.length],
      left: (i * 13.7 + (i % 7) * 5) % 98,
      top: (i * 11.3 + (i % 5) * 8) % 98,
      rotate: (i * 17) % 360,
      size: 10 + (i % 4) * 2,
    }))
  }, [])
  return (
    <div className="bg-symbols-layer" aria-hidden>
      {symbols.map(({ id, text, left, top, rotate, size }) => (
        <span
          key={id}
          className="bg-symbol"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            transform: `rotate(${rotate}deg)`,
            fontSize: `${size}px`,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  )
}

function BackgroundOrbs() {
  const orbs = useMemo(
    () => [
      { class: 'bg-orb bg-orb--accent', style: { width: '420px', height: '420px', left: '-8%', top: '-10%', animationDelay: '0s' } },
      { class: 'bg-orb bg-orb--secondary', style: { width: '380px', height: '380px', right: '-6%', top: '25%', animationDelay: '-5s' } },
      { class: 'bg-orb bg-orb--accent', style: { width: '320px', height: '320px', left: '40%', bottom: '-5%', animationDelay: '-10s' } },
      { class: 'bg-orb bg-orb--secondary', style: { width: '280px', height: '280px', right: '20%', top: '-5%', animationDelay: '-7s' } },
    ],
    []
  )
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <div key={i} className={orb.class} style={orb.style} />
      ))}
    </div>
  )
}

function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 12 + Math.random() * 12,
      delay: Math.random() * -20,
      secondary: i % 4 === 0,
    }))
  }, [])

  return (
    <div className="particles-bg" aria-hidden>
      {particles.map(({ id, left, size, duration, delay, secondary }) => (
        <div
          key={id}
          className={`particle ${secondary ? 'particle--secondary' : ''}`}
          style={{
            left: `${left}%`,
            width: size,
            height: size,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function TypingEffect({ lines, onComplete }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const line = lines[lineIndex] ?? ''

  useEffect(() => {
    if (charIndex < line.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 35 + Math.random() * 25)
      return () => clearTimeout(t)
    }
    if (lineIndex < lines.length - 1) {
      setShowCursor(false)
      const t = setTimeout(() => {
        setLineIndex((l) => l + 1)
        setCharIndex(0)
        setShowCursor(true)
      }, 500)
      return () => clearTimeout(t)
    }
    onComplete?.()
  }, [charIndex, lineIndex, line.length, lines.length])

  const renderLine = (fullLine, isComplete, visibleLength) => {
    if (isComplete) {
      const match = fullLine.match(/^(const \w+) = ("[^"]*");?$/)
      if (match) {
        return (
          <>
            <span className="text-[var(--color-secondary)]">{match[1]} = </span>
            <span className="text-[var(--color-accent)]">{match[2]}</span>
            <span className="text-[var(--color-muted)]">;</span>
          </>
        )
      }
      return <span className="text-[var(--color-text)]">{fullLine}</span>
    }
    return (
      <>
        <span className="text-[var(--color-text)]">{fullLine.slice(0, visibleLength)}</span>
        {showCursor && <span className="typing-cursor" />}
      </>
    )
  }

  return (
    <div className="font-mono text-sm">
      {lines.slice(0, lineIndex + 1).map((l, i) => (
        <div key={i} className="flex items-start gap-0">
          <span className="select-none shrink-0 text-[var(--color-muted)]">{i + 1}</span>
          <span className="ml-3 shrink-0 text-[var(--color-muted)]">│</span>
          <span className="ml-2 break-all">{renderLine(l, i < lineIndex, i === lineIndex ? charIndex : l.length)}</span>
        </div>
      ))}
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]">
          divyesh.dev
        </a>
        <nav className="hidden gap-8 sm:flex">
          {NAV.map(({ label, href }) => (
            <a key={label} href={href} className="nav-link text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="text-sm text-[var(--color-muted)] sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--color-border)] px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            {NAV.map(({ label, href }) => (
              <a key={label} href={href} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]" onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-4 font-mono backdrop-blur sm:p-6">
        <div className="mb-2 flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
          <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
          <span className="h-2 w-2 rounded-full bg-[#eab308]" />
          <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
          <span className="ml-2 text-xs text-[var(--color-muted)]">portfolio.ts</span>
        </div>
        <TypingEffect lines={TYPING_LINES} />
      </div>

      <div className="mt-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">
          Divyesh Chauhan
        </h1>
        <p className="mt-3 text-xl text-[var(--color-accent)]">Web Developer & Programmer</p>
        <p className="mt-4 max-w-xl text-[var(--color-muted)] leading-relaxed">
          I build web apps, automation tools, and clean code. Computer Engineering student at Gujarat Technological University—focused on clarity and learning by shipping.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            Gujarat Technological University
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            Open to internships & projects
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn-primary rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)]">
            View projects
          </a>
          <a href={CV_URL} download="Divyesh_Chauhan_CV.pdf" className="btn-outline rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]">
            Download CV
          </a>
          <a href="#contact" className="btn-outline rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-muted)]">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}

function About() {
  const focus = [
    'Web development (React, Node, full-stack)',
    'Automation & scripting (Python)',
    'Clean, maintainable code and clear APIs',
  ]
  return (
    <section id="about" className="border-t border-[var(--color-border)] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="section-label"># About</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)] md:text-3xl">Code, craft, ship.</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-[var(--color-muted)] leading-relaxed">
              I&apos;m a Computer Engineering student at Gujarat Technological University. I turn ideas into software—from voice-controlled desktop AI and video tools to web applications and APIs.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              I focus on readable code, performance, and learning by building. Open to internships, freelance projects, and collaboration.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-sm font-medium text-[var(--color-accent)]">What I focus on</h3>
            <ul className="mt-3 space-y-2">
              {focus.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="border-t border-[var(--color-border)] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="section-label"># Skills</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)] md:text-3xl">Tech stack</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Languages, frameworks, and tools I work with.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="skill-pill rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-mono text-sm text-[var(--color-text)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="border-t border-[var(--color-border)] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="section-label"># Projects</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)] md:text-3xl">Things I&apos;ve built</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Selected work—more on GitHub.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{project.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="font-mono text-xs text-[var(--color-accent)]">{t}</span>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-[var(--color-accent)]">View repository →</p>
            </a>
          ))}
        </div>
        <a
          href="https://github.com/Divyesh-Chauhan?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-6 inline-flex rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]"
        >
          More projects on GitHub →
        </a>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="border-t border-[var(--color-border)] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="section-label"># Contact</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)] md:text-3xl">Let&apos;s work together</h2>
        <p className="mt-4 max-w-2xl text-[var(--color-muted)] leading-relaxed">
          I&apos;m open to internships, freelance projects, and collaboration. Whether you have a project in mind, want to discuss ideas, or just say hi—I&apos;d love to hear from you. I typically reply within a day or two.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-sm font-medium text-[var(--color-accent)]">Email & CV</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Best for project inquiries and formal contact.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="mailto:chauhandivyesh313@gmail.com" className="btn-primary inline-flex w-fit rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)]">
                chauhandivyesh313@gmail.com
              </a>
              <a href={CV_URL} download="Divyesh_Chauhan_CV.pdf" className="btn-outline inline-flex w-fit rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]">
                Download CV
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-sm font-medium text-[var(--color-accent)]">Social & profiles</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Connect or browse my work and activity.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://github.com/Divyesh-Chauhan" target="_blank" rel="noopener noreferrer" className="btn-outline rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/divyesh-chauhan-031287244/" target="_blank" rel="noopener noreferrer" className="btn-outline rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-mono text-sm text-[var(--color-muted)]">© {new Date().getFullYear()} Divyesh Chauhan</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <BackgroundOrbs />
      <ParticleBackground />
      <BackgroundSymbols />
      <Nav />
      <main className="content-backdrop relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
