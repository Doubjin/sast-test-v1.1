/* ===========================
   SAST App - app.js
   =========================== */

// ─── DATA ───────────────────────────────────────────────────────────────────
const TYPES = {
    ambient: {
        id: 'ambient', label: '🎙️ 현장의 앰비언스', short: '앰비언스',
        icon: '🎙️', color: '#4298B4',
        tagline: '"없으면 안 되는 사람"',
        desc: '조용하지만 없으면 안 되는 사람. 분위기를 먼저 읽고 자연스럽게 녹아드는 타입이에요. 말보다 행동으로, 꼼꼼하고 묵직하게 현장을 지탱하는 사람이에요.\n\n앰비언스가 없는 녹음은 생명이 없죠.',
        stats: [
            { label: '관찰력', pct: 92 }, { label: '안정감', pct: 88 },
            { label: '추진력', pct: 45 }, { label: '소통력', pct: 58 }
        ]
    },
    wireless: {
        id: 'wireless', label: '📡 와이어리스 송신기', short: '와이어리스',
        icon: '📡', color: '#33A474',
        tagline: '"어디서든 연결되는 사람"',
        desc: '새로운 환경에 빠르게 적응하고 사람들과 활발하게 소통하는 사람이에요. 현장에서 분위기를 살리고 팀을 하나로 묶어요.\n\n선이 없어도 소리는 닿아요.',
        stats: [
            { label: '소통력', pct: 95 }, { label: '적응력', pct: 88 },
            { label: '관찰력', pct: 62 }, { label: '안정감', pct: 70 }
        ]
    },
    mixer: {
        id: 'mixer', label: '🎚️ 믹서', short: '믹서',
        icon: '🎚️', color: '#88619A',
        tagline: '"모든 소리의 조율자"',
        desc: '여러 소리를 조율하고 균형을 맞추는 타입. 팀과의 소통을 중요시하고 함께 성장하는 것에서 보람을 찾는 사람이에요. 혼자보다 함께일 때 더 빛나요.\n\n모두의 소리가 잘 섞일 때 가장 아름다워요.',
        stats: [
            { label: '협력', pct: 90 }, { label: '분석력', pct: 75 },
            { label: '적응력', pct: 80 }, { label: '추진력', pct: 52 }
        ]
    },
    dynamic: {
        id: 'dynamic', label: '🎤 다이나믹 마이크', short: '다이나믹',
        icon: '🎤', color: '#E4AE3A',
        tagline: '"먼저 치고 나가는 사람"',
        desc: '강하고 직접적으로 소리를 잡아내는 타입. 기다리기보다 먼저 치고 나가고, 스스로 일을 만들어가는 사람이에요. 도전을 두려워하지 않아요.\n\n아직 아무도 가지 않은 사운드의 영역을 향해.',
        stats: [
            { label: '추진력', pct: 96 }, { label: '도전', pct: 92 },
            { label: '소통력', pct: 72 }, { label: '안정감', pct: 48 }
        ]
    }
};

// PART 1: scoring → type with most points wins
// A=ambient B=wireless C=mixer D=dynamic  (varies per question)
const QUESTIONS = [
    {
        text: '새로운 장비나 기술을 처음 접했을 때 나는?',
        choices: [
            { text: '매뉴얼을 꼼꼼히 읽고 천천히 익힌다', type: 'ambient' },
            { text: '일단 만져보고 부딪히며 배운다', type: 'dynamic' },
            { text: '잘 아는 사람에게 먼저 물어본다', type: 'wireless' },
            { text: '유튜브나 자료를 찾아보며 혼자 공부한다', type: 'mixer' },
        ]
    },
    {
        text: '촬영 현장에서 내 의견이 선배의 방식과 다르다고 느껴질 때 나는?',
        choices: [
            { text: '선배의 방식을 따른다. 내가 아직 모르는 게 있을 수 있으니까', type: 'ambient' },
            { text: '현장이 끝난 후 조용히 내 생각을 전달해본다', type: 'mixer' },
            { text: '적절한 타이밍에 정중하게 의견을 말해본다', type: 'wireless' },
            { text: '일단 속으로 담아두고 나중에 더 확신이 생기면 말한다', type: 'ambient' },
        ]
    },
    {
        text: '나는 새로운 팀에 합류했을 때',
        choices: [
            { text: '먼저 분위기를 파악하고 천천히 녹아든다', type: 'ambient' },
            { text: '내가 할 수 있는 걸 찾아서 먼저 치고 나간다', type: 'dynamic' },
            { text: '사람들에게 먼저 말을 걸고 친해지려 한다', type: 'wireless' },
            { text: '맡은 일을 완벽하게 해내면서 신뢰를 쌓는다', type: 'mixer' },
        ]
    },
    {
        text: '현장 촬영이 없는 내근 날, 오늘 할 일을 다 끝냈다. 당신은?',
        choices: [
            { text: '내일 현장을 위해 장비 점검을 미리 해둔다', type: 'ambient' },
            { text: '팀원들에게 도울 일이 있는지 물어본다', type: 'wireless' },
            { text: '궁금했던 기술이나 장비를 스스로 공부해본다', type: 'mixer' },
            { text: '오늘 할 일은 끝났으니 편하게 쉰다', type: 'dynamic' },
        ]
    },
    {
        text: '새로운 팀에서 아직 아무도 시도하지 않은 아이디어가 떠올랐다. 당신은?',
        choices: [
            { text: '아직 신입이니까 때가 되면 말해야지 하고 기다린다', type: 'ambient' },
            { text: '아이디어를 정리해서 팀원들에게 먼저 이야기해본다', type: 'wireless' },
            { text: '확신이 생길 때까지 혼자 더 발전시켜본다', type: 'mixer' },
            { text: '바로 윗사람에게 제안해본다', type: 'dynamic' },
        ]
    },
    {
        text: '나는 주말에 보통?',
        choices: [
            { text: '집에서 푹 쉬며 에너지를 충전한다 🛋️', type: 'ambient' },
            { text: '친구들과 활발하게 어울린다 🎉', type: 'wireless' },
            { text: '혼자 새로운 것을 배우거나 탐험한다 🌍', type: 'mixer' },
            { text: '딱히 계획 없이 흘러가는 대로 산다 😄', type: 'dynamic' },
        ]
    }
];

const PART2_QUESTIONS = [
    {
        text: '다음 중 소리를그리다가 실제로 작업한 것이 아닌 것은?',
        choices: [
            '놀면뭐하니, 탐정들의 비밀수사, 르세라핌 다큐 동시녹음',
            'G STAR 2025 NC SOFT 오프닝 사운드디자인',
            '카카오톡 & 당근 브랜드 사운드 제작',
            '치킨 브랜드 신메뉴 개발 🍗'
        ],
        correct: 3,
        explanation: '소리를그리다는 방송 동시녹음부터 게임 이벤트, 브랜드 사운드, 자동차 사운드 아카이빙까지 — 생각보다 훨씬 넓은 세계에서 일하고 있어요.'
    },
    {
        text: '소리를그리다의 현장 문화를 가장 잘 설명한 것은?',
        choices: [
            '모든 상황에서 자유롭고 수평적인 소통',
            '사무실에서는 수평적, 현장에서는 감독 지휘 아래 팀워크',
            '개인의 판단을 최우선으로 하는 자율적인 문화',
            '철저한 위계질서 아래 움직이는 현장 중심 문화'
        ],
        correct: 1,
        explanation: '평소엔 수평적으로 이야기 나누고, 현장에선 감독의 지휘 아래 빠릿하게 움직여요. 두 모드를 자연스럽게 오갈 수 있는 사람이 잘 맞아요.'
    },
    {
        text: '소리를그리다 스태프에게 절대 생길 수 없는 일은?',
        choices: [
            '어제는 서울, 오늘은 부산, 내일은 LA ✈️',
            '촬영장에서 해외 팀과 영어로 대화하기',
            '내근 시 10시 출근 6시 퇴근 🕙',
            '매일 똑같은 시간에 출퇴근하며 같은 일만 반복 😴'
        ],
        correct: 3,
        explanation: '소리를그리다는 서울부터 LA까지 누비고, 촬영장에서 영어로 소통하는 일도 있어요. 내근 날엔 10시에 여유롭게 시작하는 하루까지 — 소리를그리다엔 똑같은 하루가 없어요.'
    }
];

const CALLSHEET_FIELDS = [
    { id: 'cs_name', label: '스텝 이름', question: '이름이 어떻게 되세요?', type: 'text', placeholder: '홍길동' },
    { id: 'cs_gender', label: '성별', question: '성별을 선택해주세요', type: 'card', options: ['남', '여', '기타'] },
    { id: 'cs_age', label: '나이', question: '나이가 어떻게 되세요?', type: 'text', placeholder: '예: 27' },
    { id: 'cs_region', label: '거주 지역', question: '어느 지역에 계세요?', type: 'text', placeholder: '예: 마포구' },
    { id: 'cs_phone', label: '연락처', question: '연락처를 남겨주세요', type: 'text', placeholder: '010-0000-0000' },
    { id: 'cs_email', label: '이메일', question: '이메일 주소를 알려주세요', type: 'text', placeholder: 'you@example.com' },
    { id: 'cs_career', label: '경력', question: '현장 경력이 어떻게 되세요?', type: 'card', options: ['신입', '1년', '2년', '3년+'] },
    {
        id: 'cs_skills', label: '특기 파트', question: '잘하는 파트를 모두 선택해주세요', type: 'multi',
        options: ['붐 오퍼레이터', '와이어리스 (RF 테크)', '믹서 (사운드 믹서)', 'SR (공연 음향)', '사운드 디자인', '기타']
    }
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let state = {
    currentScreen: 'intro',
    qIndex: 0,
    scores: { ambient: 0, wireless: 0, mixer: 0, dynamic: 0 },
    history: [], // { qIndex, type } 이전 답변 기록
    resultType: null,
    p2Index: 0,
    p2Score: 0,
    p2Answered: false,
    csIndex: 0,
    csData: {},
    multiSelected: []
};

// ─── PARTICLES ───────────────────────────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function makeParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 2,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.25 + 0.05,
        color: ['#FF4D6D', '#FF8FA3', '#FFF0F3', '#FF4D6D'][Math.floor(Math.random() * 4)]
    };
}
for (let i = 0; i < 28; i++) particles.push(makeParticle());

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
});

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        // subtle mouse attraction
        const mx = (mouse.x - p.x) * 0.00008;
        const my = (mouse.y - p.y) * 0.00008;
        p.x += p.dx + mx;
        p.y += p.dy + my;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ─── SCREEN TRANSITION (3D) ───────────────────────────────────────────────
function showScreen(nextId) {
    const current = document.querySelector('.screen.active');
    const next = document.getElementById('screen-' + nextId);
    if (!next) return;
    if (current && current !== next) {
        current.classList.add('exit');
        current.classList.remove('active');
        setTimeout(() => current.classList.remove('exit'), 400);
    }
    setTimeout(() => {
        next.classList.add('active');
        state.currentScreen = nextId;
    }, current && current !== next ? 120 : 0);
}

// ─── START TEST ───────────────────────────────────────────────────────────
function startTest() {
    state = {
        ...state,
        qIndex: 0,
        scores: { ambient: 0, wireless: 0, mixer: 0, dynamic: 0 },
        history: [],
        resultType: null,
        p2Index: 0, p2Score: 0,
        csIndex: 0, csData: {}, multiSelected: []
    };
    renderQuestion();
    showScreen('question');
}

// ─── CONFIGURATION ────────────────────────────────────────────────────────
const GOOGLE_SHEET_URL = ""; // 구글 앱스 스크립트 웹 앱 URL을 여기에 붙여넣으세요.
const CHOICE_COLORS = ['#4298B4', '#33A474', '#88619A', '#E4AE3A'];
const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

function updateProgress(idx, total) {
    const pct = (idx / total) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-dot').style.left = pct + '%';
}

function renderQuestion(direction = 'forward') {
    const q = QUESTIONS[state.qIndex];
    const counter = state.qIndex + 1;
    document.getElementById('q-counter').textContent = `Q${counter} / ${QUESTIONS.length}`;
    document.getElementById('q-text').textContent = q.text;
    updateProgress(state.qIndex, QUESTIONS.length);

    // 뒤로가기 버튼 표시 여부
    const backBtn = document.getElementById('btn-back-q');
    if (backBtn) backBtn.style.visibility = state.qIndex === 0 ? 'hidden' : 'visible';

    const choices = document.getElementById('choices');
    choices.innerHTML = '';
    q.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.setProperty('--btn-color', CHOICE_COLORS[i]);
        btn.id = `choice-${i}`;
        btn.innerHTML = `
      <span class="choice-letter">${CHOICE_LETTERS[i]}</span>
      <span class="choice-text">${c.text}</span>
      <span class="choice-check">✓</span>
    `;
        btn.addEventListener('click', () => selectChoice(i, c.type, btn));
        choices.appendChild(btn);
    });
}

function selectChoice(idx, type, btnEl) {
    // disable all
    document.querySelectorAll('.choice-btn').forEach(b => {
        b.style.pointerEvents = 'none';
        b.classList.remove('selected');
    });
    btnEl.classList.add('selected', 'bounce');

    // 이력 저장
    state.history.push({ qIndex: state.qIndex, type });
    state.scores[type]++;

    setTimeout(() => {
        state.qIndex++;
        if (state.qIndex < QUESTIONS.length) {
            // 3D card swap (앞으로)
            const card = document.getElementById('question-card');
            card.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s';
            card.style.transform = 'perspective(800px) translateZ(-40px) scale(0.94)';
            card.style.opacity = '0';
            setTimeout(() => {
                renderQuestion('forward');
                card.style.transform = 'perspective(800px) translateZ(30px) scale(0.96)';
                setTimeout(() => {
                    card.style.transform = 'perspective(800px) translateZ(0) scale(1)';
                    card.style.opacity = '1';
                }, 60);
            }, 280);
        } else {
            showLoading();
        }
    }, 620);
}

// ─── BACK BUTTON ─────────────────────────────────────────────────────────
function goBack() {
    if (state.history.length === 0) return;

    // 마지막 답변 되돌리기
    const last = state.history.pop();
    state.scores[last.type] = Math.max(0, state.scores[last.type] - 1);
    state.qIndex = last.qIndex;

    // 3D card swap (뒤로)
    const card = document.getElementById('question-card');
    card.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s';
    card.style.transform = 'perspective(800px) translateZ(40px) scale(1.04)';
    card.style.opacity = '0';
    setTimeout(() => {
        renderQuestion('back');
        card.style.transform = 'perspective(800px) translateZ(-20px) scale(0.97)';
        setTimeout(() => {
            card.style.transform = 'perspective(800px) translateZ(0) scale(1)';
            card.style.opacity = '1';
        }, 60);
    }, 280);
}

// ─── LOADING ─────────────────────────────────────────────────────────────
const LOADING_STEPS_DATA = [
    { text: '✓ 장비 친화도 분석 완료', delay: 400 },
    { text: '✓ 커뮤니케이션 패턴 분석 완료', delay: 950 },
    { text: '⟳ 팀 융화력 계산 중...', delay: 1500 },
    { text: '✓ 사운드 유형 확정!', delay: 2100 }
];

function showLoading() {
    showScreen('loading');
    const bar = document.getElementById('loading-bar');
    const stepsEl = document.getElementById('loading-steps');
    stepsEl.innerHTML = LOADING_STEPS_DATA.map(s => `<div class="loading-step">${s.text}</div>`).join('');
    const stepEls = stepsEl.querySelectorAll('.loading-step');

    let pct = 0;
    const iv = setInterval(() => {
        pct = Math.min(pct + 1.8, 100);
        bar.style.width = pct + '%';
        if (pct >= 100) clearInterval(iv);
    }, 30);

    LOADING_STEPS_DATA.forEach((s, i) => {
        setTimeout(() => stepEls[i].classList.add('visible'), s.delay);
    });

    setTimeout(() => showResult(), 2800);
}

// ─── RESULT ───────────────────────────────────────────────────────────────
function calcResult() {
    let max = -1, type = 'ambient';
    for (const [k, v] of Object.entries(state.scores)) {
        if (v > max) { max = v; type = k; }
    }
    return TYPES[type];
}

function showResult() {
    const t = calcResult();
    state.resultType = t;

    document.getElementById('result-card').style.setProperty('--result-color', t.color);
    document.getElementById('result-badge').textContent = t.short;
    document.getElementById('result-badge').style.background = t.color;
    document.getElementById('result-icon').textContent = t.icon;
    document.getElementById('result-tagline').textContent = t.tagline;
    document.getElementById('result-desc').textContent = t.desc;

    const statsEl = document.getElementById('result-stats');
    statsEl.innerHTML = t.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <div class="stat-track">
        <div class="stat-bar" style="background:${t.color}" data-pct="${s.pct}"></div>
      </div>
      <span class="stat-pct">${s.pct}%</span>
    </div>
  `).join('');

    showScreen('result');

    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.stat-bar').forEach((b, i) => {
            setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, i * 160);
        });
    }, 400);
}

function goToMaruiri() {
    renderStatistics();
    showScreen('mamuiri');
}

function renderStatistics() {
    const statsList = document.getElementById('stats-list');
    statsList.innerHTML = '<div class="stats-loading">📊 통계 데이터를 불러오는 중...</div>';

    // 가상의 초기 데이터 (서버 연결 실패 시 대비)
    const fallbackStats = [
        { id: 'ambient', label: '🎙️ 앰비언스', pct: 25 },
        { id: 'wireless', label: '📡 와이어리스', pct: 25 },
        { id: 'mixer', label: '🎚️ 믹서', pct: 25 },
        { id: 'dynamic', label: '🎤 다이나믹', pct: 25 }
    ];

    if (!GOOGLE_SHEET_URL) {
        // URL이 없으면 0.5초 후 가상 데이터 표시
        setTimeout(() => {
            renderStatsList(fallbackStats);
        }, 500);
        return;
    }

    // Google Sheets에서 실시간 데이터 가져오기 (GET)
    fetch(GOOGLE_SHEET_URL)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.stats) {
                renderStatsList(data.stats.map(s => ({
                    ...s,
                    label: TYPES[s.id].short
                })));
            } else {
                throw new Error('Invalid data format');
            }
        })
        .catch(err => {
            console.error('Failed to fetch stats:', err);
            renderStatsList(fallbackStats); // 실패 시 기본 데이터
        });
}

function renderStatsList(statsData) {
    const statsList = document.getElementById('stats-list');
    statsList.innerHTML = '';

    statsData.forEach(item => {
        const typeData = TYPES[item.id] || { color: '#888', short: item.id };
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <div class="stat-header">
                <span class="stat-name">${typeData.icon} ${typeData.short}</span>
                <span class="stat-value">${item.pct}%</span>
            </div>
            <div class="stat-progress-bg">
                <div class="stat-progress-fill" style="background: ${typeData.color}; width: 0%"></div>
            </div>
        `;
        statsList.appendChild(statItem);

        // 애니메이션 효과
        setTimeout(() => {
            const fill = statItem.querySelector('.stat-progress-fill');
            fill.style.width = item.pct + '%';
        }, 100);
    });
}

function goBackFromMamuiri() {
    showScreen('result');
}

// ─── CALLSHEET ────────────────────────────────────────────────────────────
function goToCallsheet() {
    renderCallsheetForm();
    showScreen('callsheet');
}

function renderCallsheetForm() {
    const card = document.getElementById('cs-card');

    // Helper to render individual field HTML
    const getFieldHTML = (f) => {
        let inputHTML = '';
        if (f.type === 'text') {
            inputHTML = `<input class="cs-input" id="${f.id}" type="text" placeholder="${f.placeholder}" />`;
        } else if (f.type === 'card') {
            inputHTML = `
            <div class="cs-card-options" data-field="${f.id}">
              ${f.options.map((o, i) => `
                <button class="cs-option" onclick="csSelectOne('${f.id}', ${i}, this)">${o}</button>
              `).join('')}
            </div>`;
        } else if (f.type === 'multi') {
            inputHTML = `
            <div class="cs-multi-options" data-field="${f.id}">
              ${f.options.map((o, i) => `
                <div class="cs-multi-option" onclick="csToggleMultiNew('${f.id}', ${i}, this)">
                  <div class="cs-checkbox">✓</div>
                  ${o}
                </div>
              `).join('')}
            </div>`;
        }
        return `
          <div class="cs-field-group" data-id="${f.id}">
            <label class="cs-label-new">${f.label}</label>
            ${inputHTML}
          </div>
        `;
    };

    // Fields mapping for easier access
    const F = {};
    CALLSHEET_FIELDS.forEach(f => { F[f.id] = f; });

    card.innerHTML = `
    <div class="cs-header">
      <h2 class="cs-title">인재 등록</h2>
      <p class="cs-desc">당신의 정보를 알려주세요 😊</p>
    </div>
    
    <div class="cs-form-compact">
      <div class="cs-row">
        ${getFieldHTML(F.cs_name)}
        ${getFieldHTML(F.cs_gender)}
      </div>
      <div class="cs-row">
        ${getFieldHTML(F.cs_age)}
        ${getFieldHTML(F.cs_region)}
      </div>
      <div class="cs-row">
        ${getFieldHTML(F.cs_phone)}
        ${getFieldHTML(F.cs_email)}
      </div>
      ${getFieldHTML(F.cs_career)}
      ${getFieldHTML(F.cs_skills)}
      
      <p class="cs-note">🔒 정보는 채용 목적 외 사용되지 않아요.</p>
      <button class="btn-primary" onclick="submitCallsheet()">등록 완료 →</button>
    </div>
  `;
}

function csSelectOne(fieldId, optIdx, btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.cs-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.csData[fieldId] = CALLSHEET_FIELDS.find(f => f.id === fieldId).options[optIdx];
}

function csToggleMultiNew(fieldId, optIdx, el) {
    el.classList.toggle('selected');
    const f = CALLSHEET_FIELDS.find(field => field.id === fieldId);
    if (!state.csData[fieldId]) state.csData[fieldId] = [];

    const val = f.options[optIdx];
    if (el.classList.contains('selected')) {
        if (!state.csData[fieldId].includes(val)) state.csData[fieldId].push(val);
    } else {
        state.csData[fieldId] = state.csData[fieldId].filter(v => v !== val);
    }
}

function submitCallsheet() {
    // Collect text inputs
    CALLSHEET_FIELDS.forEach(f => {
        if (f.type === 'text') {
            const inp = document.getElementById(f.id);
            if (inp) state.csData[f.id] = inp.value.trim();
        }
    });

    // Validation
    if (!state.csData.cs_name) {
        alert('이름을 입력해주세요!');
        return;
    }

    // 전송 버튼 시각적 배려
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '전송 중... 🚀';
    }

    // Google Sheets로 전송 (URL이 설정된 경우에만)
    if (GOOGLE_SHEET_URL) {
        // 결과 유형 추가
        const finalData = {
            ...state.csData,
            resultType: state.resultType ? state.resultType.id : ''
        };

        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script 연동 시 일반적인 방식
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        })
            .then(() => {
                console.log('Data sent successfully');
                goToPartTwoIntro();
            })
            .catch(err => {
                console.error('Error sending data:', err);
                alert('데이터 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '등록 완료 →';
                }
            });
    } else {
        // URL이 없는 경우 바로 다음 단계로 (디버깅용)
        console.warn('GOOGLE_SHEET_URL이 설정되지 않았습니다.');
        console.log('Final Callsheet Data:', state.csData);
        goToPartTwoIntro();
    }
}

// ─── PART 2 ───────────────────────────────────────────────────────────────
function goToPartTwoIntro() { showScreen('part2-intro'); }
function goToPartTwo() { showScreen('part2-intro'); }

function startPartTwo() {
    state.p2Index = 0;
    state.p2Score = 0;
    renderP2Q();
    showScreen('part2');
}

function renderP2Q() {
    const q = PART2_QUESTIONS[state.p2Index];
    const pct = (state.p2Index / PART2_QUESTIONS.length) * 100;
    document.getElementById('p2-progress-bar').style.width = pct + '%';
    document.getElementById('p2-progress-dot').style.left = pct + '%';
    document.getElementById('p2-counter').textContent = `Q${state.p2Index + 1} / ${PART2_QUESTIONS.length}`;
    document.getElementById('p2-text').textContent = q.text;
    document.getElementById('p2-feedback').style.display = 'none';
    document.getElementById('p2-next-btn').style.display = 'none';
    state.p2Answered = false;

    const choices = document.getElementById('p2-choices');
    choices.innerHTML = '';
    q.choices.forEach((c, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.setProperty('--btn-color', CHOICE_COLORS[i]);
        btn.id = `p2-c-${i}`;
        btn.innerHTML = `
      <span class="choice-letter">${CHOICE_LETTERS[i]}</span>
      <span class="choice-text">${c}</span>
      <span class="choice-check">✓</span>
    `;
        btn.addEventListener('click', () => answerP2(i, btn));
        choices.appendChild(btn);
    });
}

function answerP2(idx, btnEl) {
    if (state.p2Answered) return;
    state.p2Answered = true;
    const q = PART2_QUESTIONS[state.p2Index];
    const correct = (idx === q.correct);
    if (correct) state.p2Score++;

    document.querySelectorAll('#p2-choices .choice-btn').forEach(b => {
        b.style.pointerEvents = 'none';
        b.classList.remove('selected');
    });
    btnEl.classList.add('selected', 'bounce');

    // Highlight correct
    const correctBtn = document.getElementById(`p2-c-${q.correct}`);
    if (correctBtn) {
        correctBtn.style.borderColor = '#33A474';
        correctBtn.style.background = 'rgba(51,164,116,0.12)';
    }

    const fb = document.getElementById('p2-feedback');
    fb.className = 'feedback-card ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = `<strong>${correct ? '✅ 정답이에요!' : '❌ 아쉽게도 오답이에요.'}</strong><br>${q.explanation}`;
    fb.style.display = 'block';
    document.getElementById('p2-next-btn').style.display = 'block';
}

function nextPartTwoQ() {
    state.p2Index++;
    if (state.p2Index < PART2_QUESTIONS.length) {
        // 3D card swap
        const card = document.getElementById('p2-card');
        card.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s';
        card.style.transform = 'perspective(800px) translateZ(-40px) scale(0.94)';
        card.style.opacity = '0';
        setTimeout(() => {
            renderP2Q();
            card.style.transform = 'perspective(800px) translateZ(30px) scale(0.96)';
            card.style.opacity = '1';
            setTimeout(() => {
                card.style.transform = 'perspective(800px) translateZ(0) scale(1)';
            }, 60);
        }, 280);
    } else {
        goToAboutSRG();
    }
}

function goToAboutSRG() {
    showScreen('about-srg');
}

// ─── ENDING ───────────────────────────────────────────────────────────────
function goToEnding() {
    const t = state.resultType || TYPES.ambient;
    const summary = document.getElementById('score-summary');
    summary.innerHTML = `당신의 유형: <strong style="color:${t.color}">${t.short}</strong>
    ${state.p2Score !== undefined ? `  |  퀴즈 정답: ${state.p2Score}/${PART2_QUESTIONS.length}` : ''}`;
    showScreen('ending');
}

function restartTest() {
    showScreen('intro');
}
