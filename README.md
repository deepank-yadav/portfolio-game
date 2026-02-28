<div align="center">

# ⚔️ Quest for the Code

**An Interactive RPG-Style Developer Portfolio**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-deepankyadav.netlify.app-00E5FF?style=for-the-badge)](https://deepankyadav.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-deepank--yadav-FFD700?style=for-the-badge&logo=github)](https://github.com/deepank-yadav)
[![Medium](https://img.shields.io/badge/Blog-@thecodebean-00FF88?style=for-the-badge&logo=medium)](https://medium.com/@thecodebean)
[![Buy Me a Coffee](https://img.shields.io/badge/☕_Buy_Me_a_Coffee-deepank-orange?style=for-the-badge)](https://buymeacoffee.com/deepank)
[![Version](https://img.shields.io/badge/version-v1.2.0-B44BFF?style=for-the-badge)](#changelog)

![Quest for the Code](images/og-image.png)

</div>

---

## 🎮 What Is This?

Quest for the Code is a free, open-source developer portfolio built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no dependencies. Instead of a boring resume-style page, your portfolio is a fully interactive RPG game world where visitors explore different zones to learn about you.

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| 🌐 Live Demo | https://deepankyadav.netlify.app |
| 💻 GitHub Repo | https://github.com/deepank-yadav |
| ✍️ Medium Blog | https://medium.com/@thecodebean |
| ☕ Buy Me a Coffee | https://buymeacoffee.com/deepank |

---

## ✨ Features

- 🗺️ **RPG Game World** — explore 8 interactive zones via a world map
- 📡 **Live GitHub Data** — repos & follower count auto-fetch from the GitHub API on every visit
- 📰 **Live Medium Blog** — posts auto-fetched from RSS feed via a 3-proxy fallback chain
- 📬 **Working Contact Form** — powered by Formspree, lands directly in your inbox
- ⭐ **Animated Starfield** — Canvas API background with 200 twinkling stars
- 🎮 **XP System** — visitors earn XP for exploring each zone
- 🖥️ **HUD Interface** — HP/XP bars, level display, breadcrumb navigation
- 🔒 **Privacy-First** — email address never exposed anywhere in source code; contact via Formspree form only
- 🔗 **Open Graph & Twitter Cards** — rich link previews on LinkedIn, WhatsApp, and X when sharing your URL
- 🎵 **♪ ANTHEM** — ambient RPG background music (Cm pad chords + pentatonic arpeggio at 72 BPM), fades in/out smoothly
- ✦ **SPELL** — click sounds, zone enter chimes, XP gain pings, PRESS START fanfare — all via Web Audio API
- 🔈 **Audio Controls in HUD** — ♪ ANTHEM and ✦ SPELL toggle buttons styled in gold pixel font, always visible in top bar. Zero external audio files.
- 📱 **Fully Responsive** — mobile, tablet, and desktop support
- ⚡ **Zero Dependencies** — 4 files, no npm, no build step, no framework

---

## 🏰 The 8 Zones

| Zone | Icon | Description |
|------|------|-------------|
| **CHARACTER** | 👤 | Profile, bio, and live GitHub stats |
| **SKILLS FORGE** | ⚡ | Animated skill bars and tech stack arsenal |
| **BATTLE LOG** | 💼 | Work experience timeline (Adeptia Inc.) |
| **ARTIFACT HALL** | 🏗 | Projects with descriptions, tags, and GitHub links |
| **SCROLL LIBRARY** | ✍️ | Live Medium blog posts from The Code Bean |
| **ACADEMY** | 🎓 | Education — MCA from Graphic Era Hill University |
| **TROPHY VAULT** | 🏆 | Achievements, badges, and career stats |
| **SIGNAL TOWER** | 📡 | Contact links and Formspree-powered message form |

---

## 📁 File Structure

The entire project is just 4 files (plus an images folder):

```
├── index.html              # HTML structure — all screens, zones, audio controls
├── styles.css              # All styling — CSS variables, animations, responsive layout
├── main.js                 # Game logic — live data, audio engine, zone rendering, navigation
├── portfolio-config.js     # ← YOUR DATA — the only file you need to edit
└── images/
    ├── favicon.ico             # Multi-size RPG wizard favicon (16–256px)
    ├── favicon-192.png         # Android / Chrome icon
    ├── apple-touch-icon.png    # iPhone / iPad home screen icon
    └── og-image.png            # 1200×630 Open Graph social preview thumbnail
```

---

## 🚀 Getting Started (Fork & Deploy)

### Step 1 — Fork the Repository
- Go to `github.com/deepank-yadav`
- Click **Fork** → **Create fork**
- Clone locally or edit directly on GitHub

### Step 2 — Edit `portfolio-config.js` Only
This is the **only file you need to touch**. Update these sections:

| Section | What to Edit |
|---------|-------------|
| `profile` | Your name, title, company, bio, stats |
| `contact` | LinkedIn, GitHub, Twitter, Medium, Formspree URL |
| `skills` | Your technologies and proficiency percentages (0–100) |
| `experience` | Work history with dates and descriptions |
| `projects` | Projects with tags and GitHub links |
| `blogPosts` | Your Medium articles (fallback if RSS fails) |
| `education` | Degrees and institutions |
| `achievements` | Career badges and milestones |

### Step 3 — Set Up Formspree (Contact Form)
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and copy your unique endpoint URL
3. Paste it into `portfolio-config.js` → `contact.formspreeUrl`
4. Your inbox will receive all contact form submissions

### Step 4 — Deploy for Free

| Platform | How to Deploy |
|----------|--------------|
| **GitHub Pages** | Settings → Pages → Deploy from main branch → root folder |
| **Netlify** | Drag & drop your folder at netlify.com/drop — live instantly |
| **Vercel** | Import GitHub repo at vercel.com — auto-deploys on push |

---

## ⚡ Live Data Sources

| Data | Source / API | Frequency |
|------|-------------|-----------|
| GitHub repos & followers | `api.github.com/users/{username}` — no API key needed | Every visit |
| GitHub repo list & stars | `api.github.com/users/{username}/repos?per_page=100` | Every visit |
| Medium blog posts | Medium RSS → AllOrigins / rss2json / corsproxy fallback chain | Every visit |
| Contact form delivery | Formspree POST — free tier (50 submissions/month) | On submit |
| Blog follower count | Manually set in `portfolio-config.js` (no public API available) | Manual |

> **Note:** GitHub public API allows 60 requests/hour per IP. Medium RSS is capped at 10 posts — this is a hard platform limit set by Medium itself.

---

## 🎵 Audio Engine

All sounds are generated programmatically via **Web Audio API** — no MP3s, no CDN, no downloads.

| Button | Name | What it Does |
|--------|------|-------------|
| **♪** | ANTHEM | Ambient Cm pad chords with LFO tremolo + pentatonic minor arpeggio at 72 BPM. Fades in on first interaction, fades out smoothly on mute. |
| **✦** | SPELL | 5 RPG sound effects: PRESS START fanfare (8-note), zone enter chime (C-E-G), back to map tone, XP gain ping, nav button click blip |

Audio starts on first click or keypress — fully compliant with browser autoplay policies.

---

## 🎨 Customisation

All visual theming is controlled by CSS variables in `styles.css`. Change them once and the entire site updates:

```css
:root {
  --cyan:   #00E5FF;   /* primary accent, links, section labels  */
  --gold:   #FFD700;   /* titles, HUD name, zone highlights      */
  --green:  #00FF88;   /* success states, live data badges       */
  --purple: #B44BFF;   /* skill bars, secondary accents          */
  --orange: #FF6B35;   /* project cards, achievement highlights  */
  --bg:     #080818;   /* main background                        */
  --panel:  #0D1230;   /* card and panel backgrounds             */
  --dim:    #3A4A70;   /* muted text and border lines            */
  --text:   #D8E8FF;   /* primary body text                      */
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop > 700px | 3-column world map grid, full HUD with nav |
| Tablet 400–700px | 2-column world map grid, compact HUD |
| Mobile ≤ 400px | 2-column grid, icon-only bottom nav buttons |

---

## 🔒 Privacy

- Email address is **never** exposed in source code or on the page
- All contact is routed through Formspree — your inbox stays private
- No analytics, no tracking, no cookies
- GitHub API used without an API key (public endpoints only)

---

## 📄 Licence

This project is open source and free to use, modify, and distribute. If you build your own version, a ⭐ star on the repo is always appreciated!

---

## 🤝 Contributing

Found a bug or have an idea? Open an issue or submit a pull request on GitHub. All contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📋 Changelog

| Version | Date | Highlights |
|---------|------|------------|
| **v1.2.0** | Feb 2026 | Audio engine — ♪ ANTHEM ambient BGM + ✦ SPELL SFX (5 sounds); gold pixel HUD toggle buttons; instant smooth fade mute; Medium 3-proxy RSS fallback chain |
| **v1.1.0** | Feb 2026 | World map 6-col grid fix; full mobile responsive overhaul; Open Graph + Twitter Card meta tags; wizard favicon set; email privacy |
| **v1.0.0** | Jan 2026 | Initial release — 8 zones, live GitHub + Medium data, Formspree contact, starfield, XP system |

---

## 👤 Author

| Platform | Link |
|----------|------|
| GitHub | github.com/deepank-yadav |
| LinkedIn | linkedin.com/in/deepankyadav |
| Medium Blog | medium.com/@thecodebean |
| X / Twitter | @deepank_yadav |
| Buy Me a Coffee | buymeacoffee.com/deepank |

---

<div align="center">

**Built by Deepank Yadav — no frameworks harmed in the making of this portfolio** ⚔️

</div>
