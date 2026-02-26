# Divyesh Chauhan — Vista Desktop Portfolio

A professional developer portfolio built as an interactive **Windows Vista desktop** experience. Features draggable app windows, a glassmorphic UI, live GitHub API integration, EmailJS contact form, and a localStorage-powered admin CMS.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

### EmailJS Setup

1. Go to [emailjs.com](https://www.emailjs.com) and create a free account
2. Create an **Email Service** (Gmail recommended) → copy `Service ID`
3. Create **Template 1 – Developer Notification**:
   - To: `syncodexide@gmail.com`
   - Subject: `New message from {{from_name}}`
   - Body: include `{{from_name}}`, `{{from_email}}`, `{{message}}`
   - Set `Reply-To: {{reply_to}}`
   - Copy `Template ID` → set as `VITE_EMAILJS_DEV_TEMPLATE_ID`
4. Create **Template 2 – Auto Reply**:
   - To: `{{from_email}}`
   - Subject: `Thanks for reaching out!`
   - Body: confirmation message to visitor
   - Copy `Template ID` → set as `VITE_EMAILJS_REPLY_TEMPLATE_ID`
5. Go to **Account → Public Key** → copy and set as `VITE_EMAILJS_PUBLIC_KEY`

### GitHub API

No API key needed! The app uses the public GitHub REST API:
```
GET https://api.github.com/users/{username}/repos
```
Set your GitHub username in the **Admin Panel** at `/control-panel`

---

## 🔐 Admin Panel

Navigate to: `/control-panel`

| Field | Value |
|-------|-------|
| Email | `xyz@gmail.com` |
| Password | `xyz123` |

**Features:**
- Edit bio text
- Edit skills list
- Set GitHub username + toggle repo visibility
- Set social links (GitHub, LinkedIn)
- Set resume download URL

All data stored in **localStorage** (persists across sessions).

---

## 🖥️ Desktop Features

| Feature | Description |
|---------|-------------|
| **Draggable Windows** | All app windows are draggable via title bar |
| **Minimize** | Yellow button → hides window, stays in taskbar |
| **Maximize** | Green button → fills viewport |
| **Close** | Red button → removes window |
| **Taskbar** | Click open windows to minimize/restore |
| **Start Menu** | Click Start to see all apps |
| **System Clock** | Real-time clock in taskbar |
| **Double-click icons** | Open apps from desktop |

---

## 📱 Mobile

On screens < 768px width, the site automatically renders a standard scrollable portfolio layout instead of the desktop UI.

---

## ☁️ Vercel Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables from `.env` in Vercel dashboard:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_DEV_TEMPLATE_ID`
   - `VITE_EMAILJS_REPLY_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
4. Deploy → `vercel.json` handles SPA routing automatically

---

## 📁 Project Structure

```
src/
├── store/
│   ├── windowStore.js    # Window state (open/close/minimize/maximize/z-index)
│   └── cmsStore.js       # LocalStorage CMS (bio, skills, github, links)
├── components/
│   ├── desktop/
│   │   ├── Desktop.jsx   # Wallpaper + desktop icons
│   │   ├── Taskbar.jsx   # Bottom taskbar + clock
│   │   └── StartMenu.jsx # Start button popup
│   ├── window/
│   │   └── Window.jsx    # Draggable glass window wrapper
│   └── MobileLayout.jsx  # Mobile fallback layout
├── windows/
│   ├── AboutWindow.jsx   # Bio, education, skills
│   ├── ProjectsWindow.jsx # GitHub repos
│   ├── ResumeWindow.jsx  # Download + social links
│   └── ContactWindow.jsx # EmailJS contact form
├── pages/
│   ├── ControlPanel.jsx  # Admin login
│   └── AdminDashboard.jsx # CMS editor
└── App.jsx               # Router + mobile detection
```

---

## 🛠️ Tech Stack

| Tech | Use |
|------|-----|
| React + Vite | Core framework |
| TailwindCSS | Styling |
| Framer Motion | Window animations |
| Zustand | State management |
| React Draggable | Draggable windows |
| EmailJS | Frontend email sending |
| GitHub REST API | Project fetching |
| LocalStorage | CMS persistence |
| Vercel | Deployment |
