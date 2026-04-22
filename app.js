// ═══════════════════════════════════════════════
// DHAGEYSO — App Logic v1
// Unified Somali Religious Audio App
// ═══════════════════════════════════════════════

// ─── LECTURE SEARCH ENGINE ───
const TOPIC_MAP = {
    dhalinyaro: "Dhalinyarada", dhalinyarada: "Dhalinyarada", youth: "Dhalinyarada", hamiga: "Dhalinyarada", khatarta: "Dhalinyarada",
    qoys: "Qoyska", qoyska: "Qoyska", waalidka: "Qoyska", ubadka: "Qoyska", caruur: "Qoyska", hooyo: "Qoyska", aabbe: "Qoyska", family: "Qoyska", ehelka: "Qoyska",
    towxiid: "Towxiidka", towxiidka: "Towxiidka", tawheed: "Towxiidka", ilaahay: "Towxiidka", mudnaanta: "Towxiidka",
    siira: "Siirada", siirada: "Siirada", nabiga: "Siirada", nabi: "Siirada", muxammad: "Siirada", maxamed: "Siirada", rasuul: "Siirada", hijra: "Siirada",
    quraan: "Quraanka", quraanka: "Quraanka", quran: "Quraanka", aayad: "Quraanka", tasbiix: "Quraanka",
    diin: "Diinta", diinta: "Diinta", islaam: "Diinta", iimaanka: "Diinta", iimaan: "Diinta", istiqaama: "Diinta", balanta: "Diinta",
    cibaado: "Cibaadada", cibaadada: "Cibaadada", salaad: "Cibaadada", istigfaar: "Cibaadada", ducada: "Cibaadada", duco: "Cibaadada", acmaal: "Cibaadada",
    nafta: "Nafta", nafs: "Nafta", qalbi: "Nafta", qalbiga: "Nafta", xanuun: "Nafta", guul: "Nafta", sabar: "Nafta", sabir: "Nafta", waxtar: "Nafta",
    bulsho: "Bulshada", bulshada: "Bulshada", midnimo: "Bulshada", khilaaf: "Bulshada", cafis: "Bulshada", hogaamiye: "Bulshada", ummad: "Bulshada", gabadha: "Bulshada", dadka: "Bulshada",
    aakhiro: "Aakhirada", aakhirada: "Aakhirada", rajada: "Aakhirada", adduunka: "Aakhirada",
    caalami: "Caalamka", caalamka: "Caalamka", soomaaliya: "Caalamka", isbedelada: "Caalamka", nacaybka: "Caalamka",
    qurbajoog: "Qurbajoogta", qurbajoogta: "Qurbajoogta", diaspora: "Qurbajoogta", galbeedka: "Qurbajoogta",
    taariikh: "Taariikhda", taariikhda: "Taariikhda", asxaab: "Taariikhda", qiso: "Taariikhda",
    fiqhi: "Fiqhiga", fiqhiga: "Fiqhiga", axkaam: "Fiqhiga", ciid: "Fiqhiga",
    akhlaaq: "Akhlaaqda", akhlaaqda: "Akhlaaqda", hadal: "Akhlaaqda", khayr: "Akhlaaqda",
    aqoon: "Aqoonta", aqoonta: "Aqoonta", cilmi: "Aqoonta",
    dacwo: "Dacwada", dacwada: "Dacwada",
};
const GREETINGS = ["assalaamu", "salaam", "asc", "hello", "hi", "subax", "galab", "nabad"];
const SHOW_ALL = ["dhammaan", "dhamaan", "oo dhan", "all", "liiska", "tus dhammaan"];
const CATEGORY_EMOJIS = {
    Cibaadada: "🤲", Towxiidka: "☪️", Fiqhiga: "📜", Quraanka: "📖",
    Bulshada: "🏘️", Diinta: "🕌", Qoyska: "👨‍👩‍👧‍👦", Siirada: "🌙",
    Nafta: "💭", Aakhirada: "⭐", Caalamka: "🌍", Qurbajoogta: "✈️",
    Taariikhda: "📚", Akhlaaqda: "💎", Aqoonta: "🎓", Dacwada: "📣",
    Dhalinyarada: "🧑‍🎓", "Su'aalo": "❓"
};

// ─── STATE ───
let currentTab = 'lectures';
let isShuffle = false;
let isLoop = false;

// Player state
const audioEl = document.getElementById('audioElement');
const speeds = [0.75, 1, 1.25, 1.5, 2];
let currentSpeedIdx = 1;
let currentType = null;     // 'nasheed' or 'lecture'
let currentNasheedIdx = -1;
let currentLectureTitle = '';
let currentLectureCategory = '';

// ─── TAB SWITCHING ───
let previousTab = 'lectures';

function switchTab(tab) {
    if (tab !== 'favorites' && tab !== 'about') previousTab = currentTab;
    currentTab = tab;
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${tab}`).classList.add('active');
    if (tab === 'favorites') renderFavorites();
    updateMiniPlayerPadding();
}

function goBack() {
    switchTab(previousTab || 'lectures');
}

function updateMiniPlayerPadding() {
    const mp = document.getElementById('miniPlayer');
    document.querySelectorAll('.tab-view').forEach(v => {
        v.classList.toggle('has-mini-player', !mp.classList.contains('hidden'));
    });
}

// ─── LECTURE PLAYBACK ───
function playLecture(title, link, category) {
    if (!link) return;
    currentType = 'lecture';
    currentNasheedIdx = -1;
    currentLectureTitle = title;
    currentLectureCategory = category;

    audioEl.src = link;
    audioEl.load();
    audioEl.playbackRate = speeds[currentSpeedIdx];
    audioEl.play().catch(() => { });

    document.getElementById('fpTitle').textContent = title;
    document.getElementById('fpCategory').textContent = 'Sheikh Mustafe Xaaji Ismaaciil • ' + category;
    document.getElementById('miniTitle').textContent = title;

    // Mosque emoji for lectures
    const fpImg = document.getElementById('fpCoverImg');
    const fpEmoji = document.getElementById('fpEmoji');
    const mpCover = document.getElementById('miniCover');
    const mpIcon = document.getElementById('miniIcon');
    fpImg.classList.add('hidden');
    fpEmoji.textContent = CATEGORY_EMOJIS[category] || '🕌';
    fpEmoji.classList.remove('hidden');
    mpCover.classList.add('hidden');
    mpIcon.textContent = CATEGORY_EMOJIS[category] || '🎧';
    mpIcon.classList.remove('hidden');

    showMiniPlayer();
    updatePlayIcons();
    updateFavBtn();
}

// ─── LECTURE SEARCH (CHAT) ───
function findLectures(query) {
    const words = query.toLowerCase().replace(/[?.!,;:'"()]/g, "").split(/\s+/).filter(w => w.length > 0);
    const longWords = words.filter(w => w.length > 2);
    const ql = query.toLowerCase();
    for (const p of SHOW_ALL) { if (ql.includes(p)) return { type: "all", lectures: LECTURES }; }
    for (const g of GREETINGS) { if (ql.includes(g)) return { type: "greeting", lectures: [] }; }

    const matchedCats = new Set();
    for (const w of longWords) {
        if (TOPIC_MAP[w]) matchedCats.add(TOPIC_MAP[w]);
        for (const [k, c] of Object.entries(TOPIC_MAP)) {
            if (k.startsWith(w) || w.startsWith(k)) matchedCats.add(c);
        }
    }

    const titleMatches = [];
    for (const l of LECTURES) {
        const tl = l.title.toLowerCase();
        let score = 0;
        for (const w of words) { if (tl.includes(w)) score += w.length; }
        if (score > 0) titleMatches.push({ ...l, score });
    }
    titleMatches.sort((a, b) => b.score - a.score);

    const seen = new Set(), results = [];
    if (titleMatches.length > 0) {
        for (const l of titleMatches) { if (!seen.has(l.title)) { seen.add(l.title); results.push(l); } }
    } else {
        const catMatches = LECTURES.filter(l => matchedCats.has(l.category));
        for (const l of catMatches) { if (!seen.has(l.title)) { seen.add(l.title); results.push(l); } }
    }
    return { type: results.length ? "found" : "notfound", lectures: results };
}

function generateResponse(query) {
    const r = findLectures(query);
    if (r.type === "greeting") {
        const g = ["Wa calaykum assalaam! 😊 Ku soo dhawoow. Maxaad raadinaysaa maanta?",
            "Wa calaykum assalaam waraxmatullaahi wabarakaatuh! 🤲 Ii sheeg mawduuca aad xiiseynayso."];
        return g[Math.floor(Math.random() * g.length)];
    }
    if (r.type === "all") {
        let msg = `📋 **Dhammaan 82-da Muxaadaro:**\n\n`;
        const groups = {};
        for (const l of r.lectures) { (groups[l.category] = groups[l.category] || []).push(l); }
        for (const [cat, lecs] of Object.entries(groups)) {
            msg += `**${CATEGORY_EMOJIS[cat] || "📌"} ${cat}:**\n`;
            for (const l of lecs) msg += `LECTURE_CARD:${l.title}|${l.duration}|${l.category}|${l.link || ""}|${l.lecturer || "Sheikh Mustafe Xaaji Ismaaciil"}\n`;
            msg += "\n";
        }
        return msg;
    }
    if (r.type === "notfound") {
        return `Waan ka xumahay, erayga "${query}" kama dhex helin xogta aan haayo. 😔\n\nIsku day: "dhalinyarada" • "towxiidka" • "nabiga"\n\nAma qor **"dhammaan"** si aan kuuguso bandhigo dhamaan waxa aan haayo 📋`;
    }
    const c = r.lectures.length;
    let msg = c === 1 ? `Waa kan hal muxaadaro oo la xeriira "${query}":\n\n` : `Waa kuwaan **${c} muxaadaro** oo la xeriira "${query}":\n\n`;
    for (const l of r.lectures) msg += `LECTURE_CARD:${l.title}|${l.duration}|${l.category}|${l.link || ""}|${l.lecturer || "Sheikh Mustafe Xaaji Ismaaciil"}\n`;
    return msg;
}

// ─── CHAT MESSAGES ───
const chatArea = document.getElementById('chatArea');
const messagesDiv = document.getElementById('messages');
const welcomeDiv = document.getElementById('welcome');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatForm = document.getElementById('chatForm');

function addMessage(role, content) {
    if (welcomeDiv) welcomeDiv.style.display = 'none';
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'bot' ? '📚' : '👤';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = formatMessage(content);
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesDiv.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function formatMessage(text) {
    text = text.replace(
        /LECTURE_CARD:(.+?)\|(.+?)\|(.+?)\|(.*)\|(.*)/g,
        (_, title, dur, cat, link, lecturer) => {
            const st = title.replace(/'/g, "\\'");
            const sl = link.replace(/'/g, "\\'");
            const pb = link ? `<button class="lecture-play-btn" onclick="playLecture('${st}','${sl}','${cat}')">▶ Codmaal</button>` : '';
            return `<div class="lecture-card"><div class="lecture-title">📖 ${title}</div><div class="lecture-meta"><span>⏱️ ${dur}</span><span>${CATEGORY_EMOJIS[cat] || "📂"} ${cat}</span><span>👤 ${lecturer}</span>${pb}</div></div>`;
        }
    );
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'message bot'; div.id = 'typing-indicator';
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar'; avatar.textContent = '📚';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    div.appendChild(avatar); div.appendChild(bubble);
    messagesDiv.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeTyping() { const el = document.getElementById('typing-indicator'); if (el) el.remove(); }

function sendMessage(text) {
    addMessage('user', text);
    userInput.value = ''; sendBtn.disabled = true;
    showTyping();
    setTimeout(() => { removeTyping(); addMessage('bot', generateResponse(text)); }, 400 + Math.random() * 400);
}

function sendSuggestion(text) { userInput.value = text; sendMessage(text); }

// ─── FAVORITES ───
function loadFavorites() {
    try {
        const lf = JSON.parse(localStorage.getItem('dhageyso_fav_lectures') || '[]');
        window._favLectures = new Set(lf);
    } catch (e) { window._favLectures = new Set(); }
}

function saveFavorites() {
    localStorage.setItem('dhageyso_fav_lectures', JSON.stringify([...window._favLectures]));
}

function toggleLectureFav(title) {
    if (window._favLectures.has(title)) window._favLectures.delete(title);
    else window._favLectures.add(title);
    saveFavorites();
    updateFavBtn();
    showToast(window._favLectures.has(title) ? "❤️ Jeclaaday!" : "Jeclaan-kii la qaaday");
}

function toggleCurrentFavorite() {
    if (currentType === 'lecture' && currentLectureTitle) {
        toggleLectureFav(currentLectureTitle);
    }
}

function updateFavBtn() {
    const btn = document.getElementById('fpFavBtn');
    const icon = document.getElementById('fpFavIcon');
    let isFav = false;
    if (currentType === 'lecture') isFav = window._favLectures.has(currentLectureTitle);

    btn.classList.toggle('active', isFav);
    icon.innerHTML = isFav
        ? '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'
        : '<path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>';
}

function renderFavorites() {
    const favLectures = LECTURES.filter(l => window._favLectures.has(l.title));
    const total = favLectures.length;

    document.getElementById('fav-count').textContent = `${total} Saved`;
    document.getElementById('fav-empty').classList.toggle('hidden', total > 0);

    // Lectures section
    const ls = document.getElementById('fav-lectures-section');
    const ll = document.getElementById('fav-lectures-list');
    if (favLectures.length > 0) {
        ls.classList.remove('hidden');
        ll.innerHTML = favLectures.map(l => {
            const st = l.title.replace(/'/g, "\\'");
            const sl = (l.link || '').replace(/'/g, "\\'");
            return `<div class="list-item" onclick="playLecture('${st}','${sl}','${l.category}')">
                <div class="list-emoji">${CATEGORY_EMOJIS[l.category] || '📖'}</div>
                <div class="list-info">
                    <div class="list-title">${l.title}</div>
                    <div class="list-meta"><span>⏱️ ${l.duration}</span><span style="opacity:0.4">•</span><span>${l.category}</span></div>
                </div>
                <button class="fav-btn active" onclick="event.stopPropagation(); toggleLectureFav('${st}')">
                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            </div>`;
        }).join('');
    } else { ls.classList.add('hidden'); }
}

// ─── UNIFIED PLAYER CONTROLS ───
function showMiniPlayer() {
    document.getElementById('miniPlayer').classList.remove('hidden');
    updateMiniPlayerPadding();
}

function closePlayer() {
    audioEl.pause(); audioEl.src = '';
    document.getElementById('miniPlayer').classList.add('hidden');
    document.getElementById('fullPlayer').classList.add('hidden');
    currentType = null; currentNasheedIdx = -1;
    updateMiniPlayerPadding();
}

function openFullPlayer() { document.getElementById('fullPlayer').classList.remove('hidden'); }
function minimizePlayer() { document.getElementById('fullPlayer').classList.add('hidden'); }

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updatePlayIcons() {
    const playing = !audioEl.paused;
    document.getElementById('fpPlayIcon').style.display = playing ? 'none' : 'block';
    document.getElementById('fpPauseIcon').style.display = playing ? 'block' : 'none';
    document.getElementById('miniPlayIcon').style.display = playing ? 'none' : 'block';
    document.getElementById('miniPauseIcon').style.display = playing ? 'block' : 'none';
}

function cycleSpeed() {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    audioEl.playbackRate = speeds[currentSpeedIdx];
    const label = speeds[currentSpeedIdx] + 'x';
    document.getElementById('fpSpeed').textContent = label;
    document.getElementById('miniSpeed').textContent = label;
}

function initPlayer() {
    // Full player controls
    document.getElementById('fpPlayPause').addEventListener('click', () => {
        if (audioEl.paused) audioEl.play(); else audioEl.pause();
        updatePlayIcons();
    });
    document.getElementById('fpRewind').addEventListener('click', () => { audioEl.currentTime = Math.max(0, audioEl.currentTime - 10); });
    document.getElementById('fpForward').addEventListener('click', () => { audioEl.currentTime = Math.min(audioEl.duration || 0, audioEl.currentTime + 10); });
    document.getElementById('fpMinimize').addEventListener('click', minimizePlayer);
    document.getElementById('fpSpeed').addEventListener('click', cycleSpeed);
    document.getElementById('fpPrev').addEventListener('click', () => { });
    document.getElementById('fpNext').addEventListener('click', () => { });
    document.getElementById('fpShuffle').addEventListener('click', () => {
        isShuffle = !isShuffle;
        document.getElementById('fpShuffle').classList.toggle('active', isShuffle);
        showToast(isShuffle ? 'Shuffle: ON' : 'Shuffle: OFF');
    });
    document.getElementById('fpLoop').addEventListener('click', () => {
        isLoop = !isLoop;
        document.getElementById('fpLoop').classList.toggle('active', isLoop);
        showToast(isLoop ? 'Loop: ON' : 'Loop: OFF');
    });

    // Mini player controls
    document.getElementById('miniPlayPause').addEventListener('click', (e) => {
        e.stopPropagation();
        if (audioEl.paused) audioEl.play(); else audioEl.pause();
        updatePlayIcons();
    });
    document.getElementById('miniClose').addEventListener('click', (e) => { e.stopPropagation(); closePlayer(); });
    document.getElementById('miniRewind').addEventListener('click', () => { audioEl.currentTime = Math.max(0, audioEl.currentTime - 10); });
    document.getElementById('miniForward').addEventListener('click', () => { audioEl.currentTime = Math.min(audioEl.duration || 0, audioEl.currentTime + 10); });
    document.getElementById('miniSpeed').addEventListener('click', cycleSpeed);
    document.getElementById('miniPrev').addEventListener('click', () => { });
    document.getElementById('miniNext').addEventListener('click', () => { });

    // Seek bars
    const fpSeek = document.getElementById('fpSeek');
    const miniSeek = document.getElementById('miniSeek');
    fpSeek.addEventListener('input', () => { if (audioEl.duration) audioEl.currentTime = (fpSeek.value / 1000) * audioEl.duration; });
    miniSeek.addEventListener('input', () => { if (audioEl.duration) audioEl.currentTime = (miniSeek.value / 1000) * audioEl.duration; });

    // Audio events
    audioEl.addEventListener('timeupdate', () => {
        if (audioEl.duration) {
            const pct = (audioEl.currentTime / audioEl.duration) * 1000;
            fpSeek.value = pct;
            miniSeek.value = pct;
            const t = formatTime(audioEl.currentTime);
            document.getElementById('fpCurrent').textContent = t;
            document.getElementById('miniCurrent').textContent = t;
        }
    });
    audioEl.addEventListener('loadedmetadata', () => {
        const d = formatTime(audioEl.duration);
        document.getElementById('fpDuration').textContent = d;
        document.getElementById('miniDuration').textContent = d;
    });
    audioEl.addEventListener('play', () => { updatePlayIcons(); });
    audioEl.addEventListener('pause', () => { updatePlayIcons(); });
    audioEl.addEventListener('ended', () => {
        if (isLoop) { audioEl.currentTime = 0; audioEl.play(); }
        updatePlayIcons();
    });
}

// ─── TOAST ───
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ─── SHARE ───
function shareApp() {
    const data = { title: 'Codmaal: Somali Audio', text: 'Codmaal nashiidooyin iyo muxaadarooyin diineed bilaash ah! 🕌🎵', url: window.location.href };
    if (navigator.share) navigator.share(data).catch(() => { });
    else { navigator.clipboard.writeText(window.location.href).then(() => showToast('Link la koobiyeeyay!')).catch(() => { }); }
}

// ─── INIT ───
function init() {
    loadFavorites();
    initPlayer();

    // Chat form
    userInput.addEventListener('input', () => { sendBtn.disabled = !userInput.value.trim(); });
    chatForm.addEventListener('submit', (e) => { e.preventDefault(); const t = userInput.value.trim(); if (t) sendMessage(t); });
}

init();
