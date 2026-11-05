# ITC (Information Technology Club) - Member Portal & AI Assistant

A responsive web application built with **React**, pure **JSX**, and pure **CSS** (no Tailwind), featuring event discovery, registration management, secure authentication, and an AI club assistant that streams responses word-by-word.

---

## 🎨 ITC Brand Identity
- **Primary Red**: `#D63326`
- **Dark / Deep Obsidian**: `#0F1013`, `#121316`
- **White / Surfaces**: `#FFFFFF`, `#F8F9FA`
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 🚀 Key Features

### 1. Pure React JSX & CSS Architecture
- Built exclusively with `.jsx` and `.css` files.
- **Zero Tailwind CSS**: pure CSS custom properties, responsive media queries, and accessible focus styles.

### 2. Pages
- **Home (`/`)**: Hero section, live club metrics (850+ members, 140+ events), upcoming featured events, AI assistant showcase, and member benefit pillars.
- **Events List (`/events`)**: Search by title/speaker, filter by category (*Workshops, Hackathons, Tech Talks, CTF, Social*) and status (*Upcoming, Past, All*), with quick registration toggle.
- **Event Details (`/events/:id`)**: Comprehensive view with agenda breakdown, prerequisites, speaker bio, real-time capacity progress meter, and registration toggle.
- **Login / Register (`/login`, `/register`)**: Tabbed authentication with client-side validation (required fields, email format regex, password length of 8+ characters, password matching), displaying clear error messages directly *under each field*.
- **AI Assistant Chat**: Available **both** as a dedicated full-screen experience at `/chat` and as an accessible floating widget on all pages.
- **My Registrations (`/my-events`)**: Protected private member portal displaying confirmed event passes, QR check-in code, and seat release options.

### 3. Real Data & API Integration
- API base URL resolved from environment variable `VITE_API_URL` (or `NEXT_PUBLIC_API_URL`).
- All requests use `credentials: 'include'` to support secure backend `httpOnly` cookie authentication.
- Seamless mock fallback engine ensures testing works out-of-the-box even when the backend is offline.
- Built-in **Dev State Tester** (floating pill on bottom left) lets you toggle API failure mode with one click to test the Error state and « Try again » recovery on any view.

### 4. 3 States on Every Data View
Every data-driven view provides all 3 distinct states:
1. **Loading State**: Shimmering skeleton loader cards mimicking the real layout.
2. **Empty State**: Friendly illustration/icon, clear explanation, and filter reset action.
3. **Error State**: Error alert banner with a prominent **« Try again »** button that retries the request.

### 5. Chat UI with Word-by-Word Streaming
- Interactive message list with distinct member & ITC bot styling.
- Auto-scrolls to the bottom on new messages.
- Real-time typing indicator with animated pulsing dots.
- Answers stream in **word by word** mimicking live token streaming.
- **Send on Enter** (and `Shift+Enter` for multiline input).
- Suggested quick prompt chips for instant exploration.

### 6. Accessibility (a11y)
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<form>`).
- All inputs have explicit `<label htmlFor="...">` and `aria-describedby` error associations.
- Visible high-contrast focus rings (`outline: 2px solid #D63326; outline-offset: 2px`).
- Descriptive `alt` attributes on all images.
- ARIA live regions (`aria-live="polite"`, `role="alert"`, `aria-busy`).
- WCAG AA compliant color contrast ratios.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create or review `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_MOCK_FALLBACK=true
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
