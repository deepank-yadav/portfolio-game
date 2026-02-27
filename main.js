/* ═══════════════════════════════════════════════════════════
   DEEPANK YADAV — PORTFOLIO JAVASCRIPT
   Quest for the Code | main.js
   Requires: portfolio-config.js loaded BEFORE this file

   LIVE DATA SOURCES:
   ✅ GitHub  → api.github.com  (public, no key needed)
   ✅ Medium  → rss2json.com    (free RSS→JSON proxy)
   ℹ️ Medium follower count stays in portfolio-config.js
      because Medium has no public followers API.
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   LIVE DATA CACHE  (fetched once per session)
══════════════════════════════════════════ */
const LIVE = {
  github:  null,   // { repos, followers, following, bio, repoList[] }
  medium:  null,   // { posts[] }
  loading: { github: false, medium: false }
};

/* ══════════════════════════════════════════
   GITHUB API  — api.github.com (no auth needed)
   Pulls: followers, repo count, public repo list
══════════════════════════════════════════ */
async function fetchGitHub() {
  if (LIVE.github || LIVE.loading.github) return;
  LIVE.loading.github = true;

  const username = PORTFOLIO_CONFIG.contact.github.split('/').filter(Boolean).pop();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    ]);

    const userData  = await userRes.json();
    const reposData = await reposRes.json();

    LIVE.github = {
      followers: userData.followers  ?? '—',
      following: userData.following  ?? '—',
      repos:     userData.public_repos ?? '—',
      bio:       userData.bio ?? '',
      repoList:  Array.isArray(reposData)
        ? reposData.map(r => ({
            name:        r.name,
            description: r.description || 'No description provided.',
            stars:       r.stargazers_count,
            forks:       r.forks_count,
            language:    r.language || null,
            url:         r.html_url,
            updated:     new Date(r.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
          })).sort((a, b) => b.stars - a.stars)
        : []
    };
    console.log('✅ GitHub loaded:', LIVE.github.repos, 'repos,', LIVE.github.followers, 'followers');
  } catch (err) {
    console.warn('⚠️ GitHub API failed:', err);
    LIVE.github = { followers: '—', following: '—', repos: '—', bio: '', repoList: [] };
  }

  LIVE.loading.github = false;
}

/* ══════════════════════════════════════════
   MEDIUM RSS  — via rss2json.com (free)
   Pulls: latest posts with title, desc, date, tags
══════════════════════════════════════════ */
async function fetchMedium() {
  if (LIVE.medium || LIVE.loading.medium) return;
  LIVE.loading.medium = true;

  const mediumUrl = PORTFOLIO_CONFIG.contact.medium;
  const handle    = mediumUrl.includes('@') ? mediumUrl.split('@').pop() : 'thecodebean';
  const rssUrl    = `https://medium.com/feed/@${handle}`;

  // Try multiple CORS proxies in order — no post limit unlike rss2json free tier
  const proxies = [
    { url: `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`, type: 'allorigins' },
    { url: `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=50`, type: 'rss2json' },
    { url: `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`, type: 'raw' },
  ];

  function parseXML(xmlText) {
    const parser = new DOMParser();
    const xml    = parser.parseFromString(xmlText, 'text/xml');
    const items  = Array.from(xml.querySelectorAll('item'));
    return items.map(item => {
      const raw  = item.querySelector('description')?.textContent || '';
      const desc = raw.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim().slice(0, 160);
      return {
        title: item.querySelector('title')?.textContent?.trim() || 'Untitled',
        desc:  desc ? desc + '…' : '',
        date:  (() => { try { return new Date(item.querySelector('pubDate')?.textContent).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch(e) { return ''; } })(),
        link:  item.querySelector('link')?.textContent?.trim() || '#',
        tags:  Array.from(item.querySelectorAll('category')).map(c => c.textContent).slice(0, 3)
      };
    });
  }

  for (let i = 0; i < proxies.length; i++) {
    try {
      const res  = await fetch(proxies[i].url);
      const data = await res.json();

      // AllOrigins: { contents: "<xml>" }
      if (proxies[i].type === 'allorigins' && data.contents) {
        const posts = parseXML(data.contents);
        if (posts.length > 0) {
          LIVE.medium = { posts };
          console.log(`✅ Medium: ${posts.length} posts via AllOrigins`);
          LIVE.loading.medium = false;
          return;
        }
      }

      // rss2json: { status: 'ok', items: [...] }
      if (proxies[i].type === 'rss2json' && data.status === 'ok' && Array.isArray(data.items)) {
        LIVE.medium = {
          posts: data.items.map(item => ({
            title: item.title,
            desc:  item.description ? item.description.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim().slice(0, 160) + '…' : '',
            date:  (() => { try { return new Date(item.pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch(e) { return ''; } })(),
            link:  item.link,
            tags:  (item.categories || []).slice(0, 3)
          }))
        };
        console.log(`✅ Medium: ${LIVE.medium.posts.length} posts via rss2json`);
        LIVE.loading.medium = false;
        return;
      }

      // corsproxy: raw XML in response text
      if (proxies[i].type === 'raw') {
        const text  = await res.text();
        const posts = parseXML(text);
        if (posts.length > 0) {
          LIVE.medium = { posts };
          console.log(`✅ Medium: ${posts.length} posts via corsproxy`);
          LIVE.loading.medium = false;
          return;
        }
      }
    } catch (err) {
      console.warn(`Medium proxy[${i}] failed:`, err.message);
    }
  }

  // All proxies failed — fall back to static config
  console.warn('⚠️ All Medium proxies failed — using config fallback');
  LIVE.medium = {
    posts: PORTFOLIO_CONFIG.blogPosts.map(p => ({
      title: p.title, desc: p.desc, date: p.date, link: p.link, tags: []
    }))
  };
  LIVE.loading.medium = false;
}
/* ══════════════════════════════════════════
   PREFETCH — kicks off immediately on load
   Data is ready by the time user clicks a zone
══════════════════════════════════════════ */
fetchGitHub();
fetchMedium();

/* ══════════════════════════════════════════
   RETRY HELPER
   Polls every 250ms until live data arrives,
   then runs the provided callback to update DOM
══════════════════════════════════════════ */
function retryWhenReady(key, callback, maxAttempts = 30) {
  let attempts = 0;
  const poll = setInterval(() => {
    attempts++;
    if (LIVE[key]) { clearInterval(poll); callback(LIVE[key]); return; }
    if (attempts >= maxAttempts) { clearInterval(poll); }
  }, 250);
}

/* ══════════════════════════════════════════
   LOADING SPINNER
══════════════════════════════════════════ */
function spinner(msg) {
  return `<div style="text-align:center; padding:36px; font-family:'Press Start 2P',monospace;
    font-size:9px; color:var(--dim); animation:blink 1s step-end infinite;">${msg || 'LOADING...'}</div>`;
}

/* ══════════════════════════════════════════
   STARFIELD
══════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   AUDIO ENGINE — Web Audio API (zero external files)
   Generates all sounds programmatically — no downloads needed
══════════════════════════════════════════════════════════════ */

const AUDIO = {
  ctx:        null,
  musicOn:    true,
  sfxOn:      true,
  musicNode:  null,   // currently playing background music source
  musicGain:  null,
  sfxGain:    null,
  started:    false,
};

function getAudioCtx() {
  if (!AUDIO.ctx) {
    AUDIO.ctx      = new (window.AudioContext || window.webkitAudioContext)();
    AUDIO.musicGain = AUDIO.ctx.createGain();
    AUDIO.sfxGain   = AUDIO.ctx.createGain();
    AUDIO.musicGain.gain.value = 0.18;
    AUDIO.sfxGain.gain.value   = 0.5;
    AUDIO.musicGain.connect(AUDIO.ctx.destination);
    AUDIO.sfxGain.connect(AUDIO.ctx.destination);
  }
  return AUDIO.ctx;
}

/* ── BACKGROUND MUSIC ─────────────────────────────────────────
   Ambient RPG dungeon atmosphere — deep pads + slow arpeggio
   Fades in/out smoothly on toggle
──────────────────────────────────────────────────────────────*/
function startBGM() {
  if (!AUDIO.musicOn) return;
  const ctx = getAudioCtx();
  if (AUDIO.musicNode) return;

  // Ambient pad chord — Cm: C3 Eb3 G3 Bb3
  const padNotes = [130.8, 155.6, 196.0, 233.1];

  // Slow arpeggio melody over the pad — pentatonic minor feel
  const arp = [
    196.0, 233.1, 261.6, 311.1,
    261.6, 233.1, 196.0, 174.6,
    174.6, 196.0, 233.1, 261.6,
    233.1, 196.0, 174.6, 130.8,
  ];
  const arpBeat = 60 / 72; // 72 BPM, slower & more atmospheric
  let t = ctx.currentTime + 0.2;

  // sustained pad oscillators — always running, fade in via gain
  padNotes.forEach(freq => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    // slight detune for warmth
    osc.detune.value = (Math.random() - 0.5) * 8;
    // LFO tremolo — very slow wobble
    lfo.type = 'sine';
    lfo.frequency.value = 0.25;
    lfoG.gain.value = 0.04;
    lfo.connect(lfoG);
    lfoG.connect(gain.gain);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5); // fade in
    osc.connect(gain);
    gain.connect(AUDIO.musicGain);
    lfo.start();
    osc.start();
    // store refs so we can stop them
    AUDIO.padOscs = AUDIO.padOscs || [];
    AUDIO.padOscs.push({ osc, gain, lfo });
  });

  // arpeggio loop
  function scheduleArp() {
    arp.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * arpBeat);
      gain.gain.setValueAtTime(0, t + i * arpBeat);
      gain.gain.linearRampToValueAtTime(0.18, t + i * arpBeat + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * arpBeat + arpBeat * 0.9);
      osc.connect(gain);
      gain.connect(AUDIO.musicGain);
      osc.start(t + i * arpBeat);
      osc.stop(t + i * arpBeat + arpBeat);
    });
    const total = arp.length * arpBeat;
    AUDIO.musicNode = setTimeout(() => {
      t = ctx.currentTime + 0.05;
      if (AUDIO.musicOn) scheduleArp();
      else AUDIO.musicNode = null;
    }, (total - 0.3) * 1000);
  }
  scheduleArp();
}

function stopBGM() {
  // immediately ramp down pads smoothly
  if (AUDIO.padOscs && AUDIO.padOscs.length) {
    const ctx = getAudioCtx();
    AUDIO.padOscs.forEach(({ osc, gain, lfo }) => {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      setTimeout(() => { try { osc.stop(); lfo.stop(); } catch(e){} }, 500);
    });
    AUDIO.padOscs = [];
  }
  if (AUDIO.musicNode) {
    clearTimeout(AUDIO.musicNode);
    AUDIO.musicNode = null;
  }
}

/* ── SOUND EFFECTS ────────────────────────────────────────────*/

function playClick() {
  if (!AUDIO.sfxOn) return;
  const ctx = getAudioCtx();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(AUDIO.sfxGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

function playZoneEnter() {
  if (!AUDIO.sfxOn) return;
  const ctx   = getAudioCtx();
  const notes = [523.3, 659.3, 783.9];
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.08 + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + 0.15);
    osc.connect(gain);
    gain.connect(AUDIO.sfxGain);
    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.2);
  });
}

function playXPGain() {
  if (!AUDIO.sfxOn) return;
  const ctx  = getAudioCtx();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(AUDIO.sfxGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

function playPressStart() {
  if (!AUDIO.sfxOn) return;
  const ctx   = getAudioCtx();
  const notes = [261.6, 329.6, 392.0, 523.3, 392.0, 523.3, 659.3, 784.0];
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i % 2 === 0 ? 'square' : 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.07 + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.07 + 0.12);
    osc.connect(gain);
    gain.connect(AUDIO.sfxGain);
    osc.start(ctx.currentTime + i * 0.07);
    osc.stop(ctx.currentTime + i * 0.07 + 0.15);
  });
}

function playBackToMap() {
  if (!AUDIO.sfxOn) return;
  const ctx  = getAudioCtx();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(523.3, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(261.6, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(AUDIO.sfxGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/* ── TOGGLE CONTROLS ──────────────────────────────────────────*/
function toggleMusic() {
  AUDIO.musicOn = !AUDIO.musicOn;
  const btn = document.getElementById('btn-music');
  if (AUDIO.musicOn) {
    btn.classList.add('active');
    btn.querySelector('.audio-icon').textContent = '♪';
    btn.querySelector('.audio-label').textContent = 'MUSIC';
    startBGM();
  } else {
    btn.classList.remove('active');
    btn.querySelector('.audio-icon').textContent = '—';
    btn.querySelector('.audio-label').textContent = 'MUSIC';
    stopBGM(); // fades out smoothly via gain ramp
  }
  playClick();
}

function toggleSFX() {
  AUDIO.sfxOn = !AUDIO.sfxOn;
  const btn = document.getElementById('btn-sfx');
  if (AUDIO.sfxOn) {
    btn.classList.add('active');
    btn.querySelector('.audio-icon').textContent = '▶';
    btn.querySelector('.audio-label').textContent = 'SPELL';
    playClick(); // confirm it's back on
  } else {
    btn.classList.remove('active');
    btn.querySelector('.audio-icon').textContent = '—';
    btn.querySelector('.audio-label').textContent = 'SPELL';
  }
}

/* ── INIT: start audio on first user interaction ─────────────*/
function initAudio() {
  if (AUDIO.started) return;
  AUDIO.started = true;
  getAudioCtx();
  if (AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume();
  startBGM();
}

document.addEventListener('click', initAudio, { once: true });
document.addEventListener('keydown', initAudio, { once: true });

const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let stars    = [];

function initStars() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5, opacity: Math.random() });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.opacity += (Math.random() - 0.5) * 0.05;
    s.opacity  = Math.max(0.1, Math.min(1, s.opacity));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,220,255,${s.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();

/* ══════════════════════════════════════════
   BOOT — Populate from config on page load
══════════════════════════════════════════ */
function bootFromConfig() {
  const p  = PORTFOLIO_CONFIG.profile;
  const yr = new Date().getFullYear();

  document.getElementById('t-name').textContent    = `⚔ ${p.name} ⚔`;
  document.getElementById('t-avatar').textContent  = p.avatar;
  document.getElementById('t-role').textContent    = `${p.title} • ${p.company}`;
  document.getElementById('t-tagline').textContent = p.tagline;
  document.getElementById('t-copy').textContent    = `© ${yr} ${p.name} — ALL RIGHTS RESERVED`;
  document.getElementById('hud-name').textContent  = `${p.avatar} ${p.name.split(' ')[0].toUpperCase()}`;
  document.getElementById('hud-level').textContent = p.level;
  document.title = `${p.name} | Quest for the Code`;

  // Set blog count from config initially; live data will update it
  const blogDesc = document.getElementById('blog-zone-desc');
  if (blogDesc) blogDesc.textContent = `${PORTFOLIO_CONFIG.blogPosts.length} articles published`;

  // Update blog count once Medium loads
  retryWhenReady('medium', (md) => {
    const bd = document.getElementById('blog-zone-desc');
    if (bd) bd.textContent = `${md.posts.length} articles published`;
  });
}

/* ══════════════════════════════════════════
   GAME STATE
══════════════════════════════════════════ */
let xpLevel = 74;

function gainXP(el) {
  playXPGain();
  xpLevel = Math.min(100, xpLevel + 4);
  document.getElementById('xp-bar').style.width = xpLevel + '%';
  const rect    = el.getBoundingClientRect();
  const floater = document.createElement('div');
  floater.className   = 'xp-float';
  floater.textContent = '+XP';
  floater.style.left  = (rect.left + rect.width / 2) + 'px';
  floater.style.top   = rect.top + 'px';
  document.body.appendChild(floater);
  setTimeout(() => floater.remove(), 1200);
}

/* ══════════════════════════════════════════
   SCREEN NAVIGATION
══════════════════════════════════════════ */
function startGame() {
  playPressStart();
  document.getElementById('title-screen').classList.remove('active');
  document.getElementById('hud').classList.add('visible');
  document.getElementById('bottom-nav').classList.add('visible');
  document.getElementById('world-screen').classList.add('active');
  updateBottomNav('map');

  const p = PORTFOLIO_CONFIG.profile;
  setTimeout(() => {
    showDialog('SYSTEM', `Welcome, adventurer! You have entered the realm of ${p.name} — ${p.title} & Code Architect. Explore each zone to uncover the epic journey. Every zone visited grants XP!`);
  }, 600);
}

function backToMap() {
  playBackToMap();
  document.getElementById('panel-screen').classList.remove('active');
  document.getElementById('world-screen').classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  updateBottomNav('map');
}

function updateBottomNav(zone) {
  const order = ['map','about','skills','experience','projects','blogs','education','achievements','contact'];
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const idx  = order.indexOf(zone);
  const btns = document.querySelectorAll('.bnav-btn');
  if (btns[idx]) btns[idx].classList.add('active');
}

/* ══════════════════════════════════════════
   DIALOG
══════════════════════════════════════════ */
function showDialog(name, text) {
  document.getElementById('dialog-name').textContent = name;
  document.getElementById('dialog-text').textContent = text;
  document.getElementById('dialog-box').classList.add('visible');
}
function closeDialog() {
  document.getElementById('dialog-box').classList.remove('visible');
}

/* ══════════════════════════════════════════
   ZONE SYSTEM
══════════════════════════════════════════ */
const ZONE_ORDER = ['about','skills','experience','projects','blogs','education','achievements','contact'];

const ZONE_NAMES = {
  about:        '👤 CHARACTER',
  skills:       '⚡ SKILLS FORGE',
  experience:   '💼 BATTLE LOG',
  projects:     '🏗 ARTIFACT HALL',
  blogs:        '✍️ SCROLL LIBRARY',
  education:    '🎓 ACADEMY',
  achievements: '🏆 TROPHY VAULT',
  contact:      '📡 SIGNAL TOWER'
};

function showZone(zone) {
  playZoneEnter();
  document.getElementById('world-screen').classList.remove('active');
  document.getElementById('panel-screen').classList.add('active');
  document.getElementById('panel-screen').scrollTop = 0;
  updateBottomNav(zone);

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btns = document.querySelectorAll('.nav-btn');
  const idx  = ZONE_ORDER.indexOf(zone);
  if (btns[idx]) btns[idx].classList.add('active');

  const content = document.getElementById('panel-content');
  content.innerHTML = '';

  // Back + Prev/Next bar
  const zIdx    = ZONE_ORDER.indexOf(zone);
  const backBar = document.createElement('div');
  backBar.className = 'back-bar';
  backBar.innerHTML = `
    <button class="back-btn" onclick="backToMap()">◀ BACK TO MAP</button>
    <div class="zone-breadcrumb">WORLD MAP → <span>${ZONE_NAMES[zone] || zone.toUpperCase()}</span></div>
    <div style="margin-left:auto; display:flex; gap:7px;">
      ${zIdx > 0 ? `<button class="back-btn" style="border-color:var(--dim);color:var(--dim);" onclick="showZone('${ZONE_ORDER[zIdx-1]}')">◀ PREV</button>` : ''}
      ${zIdx < ZONE_ORDER.length - 1 ? `<button class="back-btn" style="border-color:var(--green);color:var(--green);" onclick="showZone('${ZONE_ORDER[zIdx+1]}')">NEXT ▶</button>` : ''}
    </div>
  `;
  content.appendChild(backBar);

  const inner = document.createElement('div');
  content.appendChild(inner);

  const renderers = {
    about:        renderAbout,
    skills:       renderSkills,
    experience:   renderExperience,
    projects:     renderProjects,
    blogs:        renderBlogs,
    education:    renderEducation,
    achievements: renderAchievements,
    contact:      renderContact,
  };
  if (renderers[zone]) renderers[zone](inner);

  if (zone === 'skills') {
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 100);
  }
}

/* ══════════════════════════════════════════
   ZONE RENDERERS
══════════════════════════════════════════ */

/* ── ABOUT ─────────────────────────────── */
function renderAbout(el) {
  const p  = PORTFOLIO_CONFIG.profile;
  const gh = LIVE.github;

  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">👤</span>
      <div class="panel-title">CHARACTER PROFILE</div>
    </div>
    <div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:22px;">
      <div style="font-size:88px; filter:drop-shadow(0 0 20px var(--purple)); flex-shrink:0;">${p.avatar}</div>
      <div style="flex:1; min-width:200px;">
        <div style="font-family:'Orbitron',monospace; font-size:20px; color:var(--gold); margin-bottom:5px;">${p.name}</div>
        <div style="font-size:15px; color:var(--border); margin-bottom:14px;">${p.title} @ ${p.company}</div>
        <div style="font-size:15px; color:var(--text); line-height:1.8;">${p.bio}</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-label">CLASS</div><div class="stat-value highlight">${p.title}</div></div>
      <div class="stat-box"><div class="stat-label">GUILD</div><div class="stat-value">${p.company}</div></div>
      <div class="stat-box"><div class="stat-label">REALM</div><div class="stat-value">${p.location}</div></div>
      <div class="stat-box"><div class="stat-label">POWER LEVEL</div><div class="stat-value highlight">${p.level} 🔥</div></div>
      <div class="stat-box">
        <div class="stat-label">🐙 GITHUB REPOS <span style="color:var(--green); font-size:10px;">LIVE</span></div>
        <div class="stat-value highlight" id="ab-repos">${gh ? gh.repos : spinner('...')}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">🐙 GH FOLLOWERS <span style="color:var(--green); font-size:10px;">LIVE</span></div>
        <div class="stat-value highlight" id="ab-followers">${gh ? gh.followers : spinner('...')}</div>
      </div>
    </div>
    <div class="section-label">HERO'S CREED</div>
    <div style="border-left:3px solid var(--purple); padding-left:14px; font-size:16px; color:var(--dim); line-height:1.8; font-style:italic;">
      "${p.creed}"
    </div>
  `;

  if (!gh) {
    retryWhenReady('github', (g) => {
      const r = document.getElementById('ab-repos');
      const f = document.getElementById('ab-followers');
      if (r) r.textContent = g.repos;
      if (f) f.textContent = g.followers;
    });
  }
}

/* ── SKILLS ─────────────────────────────── */
function renderSkills(el) {
  const skills = PORTFOLIO_CONFIG.skills;
  const tags   = PORTFOLIO_CONFIG.techTags;
  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">⚡</span>
      <div class="panel-title">SKILLS FORGE</div>
    </div>
    <div class="section-label">MASTERED ABILITIES</div>
    ${skills.map(s => `
      <div class="skill-row">
        <span class="skill-name">${s.name}</span>
        <div class="skill-bar"><div class="skill-fill" data-pct="${s.pct}" style="width:0%"></div></div>
        <span class="skill-pct">${s.pct}%</span>
      </div>
    `).join('')}
    <div class="section-label" style="margin-top:26px;">ARSENAL</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      ${tags.map(t => `<div class="tag" style="font-size:14px; border-color:var(--border); color:var(--border);">${t}</div>`).join('')}
    </div>
  `;
}

/* ── EXPERIENCE ─────────────────────────── */
function renderExperience(el) {
  const exp = PORTFOLIO_CONFIG.experience;
  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">💼</span>
      <div class="panel-title">BATTLE LOG</div>
    </div>
    <div class="section-label">PROFESSIONAL CAMPAIGNS</div>
    ${exp.map(e => `
      <div class="timeline-item">
        <div class="timeline-dot">${e.icon}</div>
        <div class="timeline-body">
          <div class="timeline-title">${e.title}</div>
          <div class="timeline-company">🏰 ${e.company}</div>
          <div class="timeline-date">📅 ${e.date}</div>
          <div class="timeline-desc">${e.desc}</div>
        </div>
      </div>
    `).join('')}
  `;
}

/* ── PROJECTS (config + live GitHub repos) ── */
function renderProjects(el) {
  const projects = PORTFOLIO_CONFIG.projects;
  const gh       = LIVE.github;

  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">🏗</span>
      <div class="panel-title">ARTIFACT HALL</div>
    </div>
    <div class="section-label">LEGENDARY CREATIONS</div>
    ${projects.map(p => `
      <div class="project-card" ${p.link ? `onclick="window.open('${p.link}','_blank')" style="cursor:pointer;"` : ''}>
        <div class="project-name">${p.name}${p.link ? ' <span style="font-size:11px;color:var(--dim);">↗</span>' : ''}</div>
        <div style="font-size:15px; color:var(--text); line-height:1.6;">${p.desc}</div>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    `).join('')}

    <div class="section-label" style="margin-top:26px;">
      🐙 GITHUB REPOSITORIES
      <span style="color:var(--green); font-size:10px; margin-left:6px;">⚡ LIVE</span>
      <span id="gh-meta" style="font-size:12px; color:var(--dim); margin-left:6px;">
        ${gh ? `${gh.repos} repos · ${gh.followers} followers` : '⏳ fetching...'}
      </span>
    </div>
    <div id="gh-repo-list">
      ${gh ? buildRepoCards(gh.repoList) : spinner('FETCHING GITHUB REPOS...')}
    </div>
  `;

  if (!gh) {
    retryWhenReady('github', (g) => {
      const list = document.getElementById('gh-repo-list');
      const meta = document.getElementById('gh-meta');
      if (list) list.innerHTML = buildRepoCards(g.repoList);
      if (meta) meta.textContent = `${g.repos} repos · ${g.followers} followers`;
    });
  }
}

function buildRepoCards(repos) {
  if (!repos || repos.length === 0) return `<div style="color:var(--dim);font-size:15px;padding:12px;">No public repos found.</div>`;
  return repos.slice(0, 12).map(r => `
    <div class="project-card" onclick="window.open('${r.url}','_blank')" style="cursor:pointer; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
        <div class="project-name" style="font-size:13px;">🐙 ${r.name} <span style="font-size:11px;color:var(--dim);">↗</span></div>
        <div style="display:flex; gap:12px; font-size:13px; color:var(--dim); flex-shrink:0;">
          <span title="Stars">⭐ ${r.stars}</span>
          <span title="Forks">🍴 ${r.forks}</span>
        </div>
      </div>
      <div style="font-size:14px; color:var(--text); margin:5px 0;">${r.description}</div>
      <div style="display:flex; gap:10px; align-items:center; margin-top:7px; flex-wrap:wrap;">
        ${r.language ? `<span class="tag" style="border-color:var(--accent);color:var(--accent);">${r.language}</span>` : ''}
        <span style="font-size:12px; color:var(--dim);">Updated ${r.updated}</span>
      </div>
    </div>
  `).join('');
}

/* ── BLOGS (live from Medium RSS) ─────── */
function renderBlogs(el) {
  const c  = PORTFOLIO_CONFIG.contact;
  const md = LIVE.medium;

  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">✍️</span>
      <div class="panel-title">SCROLL LIBRARY</div>
    </div>
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px; flex-wrap:wrap;">
      <div style="font-size:15px; color:var(--dim);">
        Live from <span style="color:var(--green);">The Code Bean</span> · Medium
        <span style="color:var(--green); font-size:10px; margin-left:6px;">⚡ LIVE</span>
        <span id="blog-post-count" style="color:var(--purple);">
          ${md ? ` · ${md.posts.length} posts` : ' · ⏳ loading...'}
        </span>
      </div>
      <a href="${c.medium}" target="_blank" class="back-btn" style="border-color:var(--green); color:var(--green); text-decoration:none; font-family:'Press Start 2P',monospace; font-size:7px; padding:7px 12px;">↗ VISIT BLOG</a>
    </div>
    <div class="section-label">PUBLISHED SCROLLS</div>
    <div id="blog-list">
      ${md ? buildBlogCards(md.posts) : spinner('FETCHING MEDIUM POSTS...')}
    </div>
  `;

  // Update map card count
  if (md) {
    const bd = document.getElementById('blog-zone-desc');
    if (bd) bd.textContent = `${md.posts.length} articles published`;
  }

  if (!md) {
    retryWhenReady('medium', (m) => {
      const list = document.getElementById('blog-list');
      const cnt  = document.getElementById('blog-post-count');
      if (list) list.innerHTML = buildBlogCards(m.posts);
      if (cnt)  cnt.textContent = ` · ${m.posts.length} posts`;
      const bd = document.getElementById('blog-zone-desc');
      if (bd) bd.textContent = `${m.posts.length} articles published`;
    });
  }
}

function buildBlogCards(posts) {
  if (!posts || posts.length === 0) return `<div style="color:var(--dim);font-size:15px;padding:12px;">No posts found.</div>`;
  return posts.map((post, i) => `
    <a class="blog-card" href="${post.link}" target="_blank">
      <span class="blog-num">#${String(i + 1).padStart(2, '0')}</span>
      <div class="blog-body">
        <div class="blog-title">${post.title}</div>
        <div class="blog-desc">${post.desc}</div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:4px;">
          <div class="blog-date">📅 ${post.date}</div>
          ${post.tags.map(t => `<span style="font-size:11px;color:var(--purple);border:1px solid var(--purple);padding:1px 6px;">${t}</span>`).join('')}
        </div>
      </div>
      <span style="color:var(--green); font-size:18px; flex-shrink:0;">↗</span>
    </a>
  `).join('');
}

/* ── EDUCATION ──────────────────────────── */
function renderEducation(el) {
  const edu   = PORTFOLIO_CONFIG.education;
  const specs = PORTFOLIO_CONFIG.specializations;
  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">🎓</span>
      <div class="panel-title">ACADEMY RECORDS</div>
    </div>
    <div class="section-label">KNOWLEDGE SCROLLS</div>
    ${edu.map(e => `
      <div class="timeline-item">
        <div class="timeline-dot">${e.icon}</div>
        <div class="timeline-body">
          <div class="timeline-title">${e.degree}</div>
          <div class="timeline-company">🎓 ${e.school}</div>
          <div class="timeline-date">📅 ${e.year}</div>
          <div class="timeline-desc">${e.desc}</div>
        </div>
      </div>
    `).join('')}
    <div class="section-label" style="margin-top:26px;">SPECIALIZATIONS</div>
    <div class="badges-grid">
      ${specs.map(s => `
        <div class="badge">
          <span class="badge-icon">${s.icon}</span>
          <div class="badge-name">${s.name}</div>
          <div class="badge-desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ── ACHIEVEMENTS (live stats) ─────────── */
function renderAchievements(el) {
  const badges = PORTFOLIO_CONFIG.achievements;
  const p      = PORTFOLIO_CONFIG.profile;
  const gh     = LIVE.github;
  const md     = LIVE.medium;

  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">🏆</span>
      <div class="panel-title">TROPHY VAULT</div>
    </div>
    <div class="section-label">LEGENDARY ACHIEVEMENTS</div>
    <div class="badges-grid">
      ${badges.map(b => `
        <div class="badge">
          <span class="badge-icon">${b.icon}</span>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="section-label" style="margin-top:26px;">
      HERO STATS
      <span style="color:var(--green); font-size:10px; margin-left:6px;">⚡ LIVE</span>
    </div>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-label">YEARS EXP</div><div class="stat-value highlight">${p.yearsExp}</div></div>
      <div class="stat-box"><div class="stat-label">PROJECTS SHIPPED</div><div class="stat-value highlight">${p.projectsShipped}</div></div>
      <div class="stat-box"><div class="stat-label">TECH STACK</div><div class="stat-value highlight">${p.techStackSize}</div></div>
      <div class="stat-box">
        <div class="stat-label">🐙 GITHUB REPOS</div>
        <div class="stat-value highlight" id="ac-repos">${gh ? gh.repos : '⏳'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">🐙 GH FOLLOWERS</div>
        <div class="stat-value highlight" id="ac-followers">${gh ? gh.followers : '⏳'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">✍️ BLOG POSTS</div>
        <div class="stat-value highlight" id="ac-posts">${md ? md.posts.length : '⏳'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">📝 BLOG FOLLOWERS</div>
        <div class="stat-value highlight">${p.mediumFollowers}</div>
      </div>
      <div class="stat-box"><div class="stat-label">BOSS DIFFICULTY</div><div class="stat-value highlight">LEGENDARY 🔥</div></div>
    </div>
  `;

  if (!gh) retryWhenReady('github', (g) => {
    const r = document.getElementById('ac-repos');
    const f = document.getElementById('ac-followers');
    if (r) r.textContent = g.repos;
    if (f) f.textContent = g.followers;
  });

  if (!md) retryWhenReady('medium', (m) => {
    const posts = document.getElementById('ac-posts');
    if (posts) posts.textContent = m.posts.length;
  });
}

/* ── CONTACT ────────────────────────────── */
function renderContact(el) {
  const c  = PORTFOLIO_CONFIG.contact;
  const p  = PORTFOLIO_CONFIG.profile;
  const gh = LIVE.github;
  const md = LIVE.medium;

  const links = [
    c.linkedin     ? { href: c.linkedin,            icon: '💼', label: 'LinkedIn',        value: (c.linkedin.split('/in/')[1] || 'View Profile').replace(/\/$/, '') } : null,
    c.github       ? { href: c.github,              icon: '🐙', label: 'GitHub',          value: gh ? `@deepank-yadav · ${gh.repos} repos · ${gh.followers} followers` : '⏳ loading...', id: 'ct-github' } : null,
    // Email hidden intentionally — use the contact form below to reach out
    c.medium       ? { href: c.medium,              icon: '📝', label: 'Medium Blog',     value: md ? `The Code Bean · ${md.posts.length} posts · ${p.mediumFollowers} followers` : '⏳ loading...', id: 'ct-medium' } : null,
    c.twitter      ? { href: c.twitter,             icon: '🐦', label: 'X / Twitter',     value: '@deepank_yadav' } : null,
    c.twitch       ? { href: c.twitch,              icon: '🎮', label: 'Twitch',           value: 'deepankyadav' } : null,
    c.buymeacoffee ? { href: c.buymeacoffee,        icon: '☕', label: 'Buy Me a Coffee',  value: 'Support the hero' } : null,
    c.kofi         ? { href: c.kofi,                icon: '🧡', label: 'Ko-Fi',            value: 'ko-fi.com/deepank' } : null,
  ].filter(Boolean);

  el.innerHTML = `
    <div class="panel-header">
      <span class="panel-icon">📡</span>
      <div class="panel-title">SIGNAL TOWER</div>
    </div>
    <div class="section-label">REACH THE HERO</div>
    <div class="contact-grid">
      ${links.map(l => `
        <a class="contact-item" href="${l.href}" target="_blank">
          <span class="contact-icon">${l.icon}</span>
          <div style="min-width:0;">
            <div class="contact-label">${l.label}</div>
            <div class="contact-value" ${l.id ? `id="${l.id}"` : ''}>${l.value}</div>
          </div>
        </a>
      `).join('')}
    </div>
    <div class="section-label" style="margin-top:26px;">STATUS</div>
    <div style="display:flex; align-items:center; gap:10px; font-size:16px; margin-bottom:22px;">
      <span style="color:var(--green); font-size:20px;">●</span>
      <span style="color:var(--text);">${p.status} — Reach out to begin the quest together!</span>
    </div>
    <div style="background:var(--panel); border:1px solid var(--dim); padding:18px;">
      <div class="section-label" style="margin-top:0">LEAVE A MESSAGE</div>
      <div id="form-feedback" style="display:none; margin-bottom:10px; font-size:15px;"></div>
      <input id="msg-name"  type="text"  placeholder="Your Name..."           style="width:100%;background:#0a0a1a;border:1px solid var(--dim);color:var(--text);padding:9px;font-family:'VT323',monospace;font-size:16px;margin-bottom:9px;outline:none;display:block;">
      <input id="msg-email" type="email" placeholder="Your Email..."           style="width:100%;background:#0a0a1a;border:1px solid var(--dim);color:var(--text);padding:9px;font-family:'VT323',monospace;font-size:16px;margin-bottom:9px;outline:none;display:block;">
      <textarea id="msg-body" placeholder="Your message to the hero..."        style="width:100%;background:#0a0a1a;border:1px solid var(--dim);color:var(--text);padding:9px;font-family:'VT323',monospace;font-size:16px;height:75px;resize:none;outline:none;display:block;margin-bottom:9px;"></textarea>
      <button id="msg-btn" onclick="sendMessage()" style="font-family:'Press Start 2P',monospace;font-size:8px;padding:9px 18px;background:transparent;border:2px solid var(--green);color:var(--green);cursor:pointer;">▶ SEND MESSAGE</button>
    </div>
  `;

  if (!gh) retryWhenReady('github', (g) => {
    const el = document.getElementById('ct-github');
    if (el) el.textContent = `@deepank-yadav · ${g.repos} repos · ${g.followers} followers`;
  });

  if (!md) retryWhenReady('medium', (m) => {
    const el = document.getElementById('ct-medium');
    if (el) el.textContent = `The Code Bean · ${m.posts.length} posts · ${p.mediumFollowers} followers`;
  });
}

function sendMessage() {
  const name  = document.getElementById('msg-name')?.value.trim();
  const email = document.getElementById('msg-email')?.value.trim();
  const body  = document.getElementById('msg-body')?.value.trim();
  const btn   = document.getElementById('msg-btn');
  const fb    = document.getElementById('form-feedback');

  // Validate
  if (!name || !email || !body) {
    showDialog('SYSTEM', 'Please fill in your name, email and message before sending!');
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    showDialog('SYSTEM', 'Please enter a valid email address!');
    return;
  }

  // Read formspree URL from config
  const formUrl = PORTFOLIO_CONFIG.contact.formspreeUrl;
  if (!formUrl) {
    showDialog('SYSTEM', 'Contact form not configured. Please reach out via email directly!');
    return;
  }

  // Disable button & show sending state
  btn.textContent    = '⏳ SENDING...';
  btn.style.opacity  = '0.6';
  btn.disabled       = true;

  fetch(formUrl, {
    method:  'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, email, message: body })
  })
  .then(res => {
    if (res.ok) {
      // Success
      document.getElementById('msg-name').value  = '';
      document.getElementById('msg-email').value = '';
      document.getElementById('msg-body').value  = '';
      btn.textContent   = '✅ SENT!';
      btn.style.borderColor = 'var(--green)';
      showDialog('SYSTEM', 'Message delivered! The hero will respond to your email shortly. +50 XP awarded for making contact!');
      setTimeout(() => {
        btn.textContent   = '▶ SEND MESSAGE';
        btn.style.opacity = '1';
        btn.disabled      = false;
      }, 3000);
    } else {
      return res.json().then(data => { throw new Error(data?.errors?.[0]?.message || 'Send failed'); });
    }
  })
  .catch(err => {
    btn.textContent   = '▶ SEND MESSAGE';
    btn.style.opacity = '1';
    btn.disabled      = false;
    showDialog('SYSTEM', '⚠️ Message failed to send. Please use the Email button above to reach out directly!');
    console.error('Formspree error:', err);
  });
}

/* ══════════════════════════════════════════
   BOOT
══════════════════════════════════════════ */
bootFromConfig();
