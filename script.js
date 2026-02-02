const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionText = document.getElementById('questionText');
const mainGif = document.getElementById('mainGif');

const noMessages = [
    "Think again!",
    "Are you sure? 😡",
    "See this... 😭",
    "You're breaking my heart!",
    "Please? ❤️"
];

/* ✅ LOCAL GIFS – FIXED */
const noGifs = [
    "picture/sad.gif",
    "picture/angry.gif",
    "picture/heartbroken.gif",
    "picture/please.gif"
];

/* preload gifs */
noGifs.forEach(src => {
    const img = new Image();
    img.src = src;
});

let noIndex = 0;
let isMoving = false;
let visitedSections = new Set();

/* Floating hearts */
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    document.body.appendChild(heartsContainer);

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 6000);
    }, 800);
}

/* Confetti */
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);

    const colors = ['#ff4d6d', '#ffc3a0', '#ffafbd', '#ff758f', '#4361ee'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confettiContainer.appendChild(piece);
        }, i * 100);
    }

    setTimeout(() => confettiContainer.remove(), 5000);
}

/* NO button */
noBtn.addEventListener('mouseenter', () => {
    if (isMoving) return;
    isMoving = true;

    const maxX = window.innerWidth - noBtn.offsetWidth - 50;
    const maxY = window.innerHeight - noBtn.offsetHeight - 50;

    const newX = Math.max(20, Math.min(maxX, Math.random() * maxX));
    const newY = Math.max(20, Math.min(maxY, Math.random() * maxY));

    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    questionText.innerText = noMessages[noIndex % noMessages.length];
    mainGif.src = noGifs[noIndex % noGifs.length];
    noIndex++;

    setTimeout(() => isMoving = false, 400);
});

/* YES button */
yesBtn.addEventListener('click', () => {
    createConfetti();
    setTimeout(() => nextPage(2), 500);
});

/* Navigation */
function nextPage(p) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(`page${p}`).classList.add('active');
}

function showSection(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'quiz-section') startQuiz();
}

function backToGifts() {
    const sectionId = document.querySelector('.card.active').id;
    visitedSections.add(sectionId);

    nextPage(3);

    /* ✅ FINALLY button pop animation restored */
    if (visitedSections.size >= 3) {
        const finallyBtn = document.getElementById('finallyBtn');
        finallyBtn.style.display = 'block';
        finallyBtn.style.animation =
            'pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
}

function showFinalPage() {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById('final-page').classList.add('active');
}

/* 🔒 FULL QUIZ – WITH GREEN / RED FEEDBACK */
const quizData = [
    { q: "Who is the absolute 'Boss'? 👑", options: ["Obviously You", "Me", "My Mom"], correct: 0 },
    { q: "Where do I plan to spend the rest of my life? ❤️", options: ["Dhule", "In Your Heart", "Nashik"], correct: 1 },
    { q: "Who is more 'Chidkuu' in our relationship ? 😤 😒", options: ["Always You", "No One", "Me"], correct: 2 },
    { q: "Who gets jealous so easily ? 🤨", options: ["Always You", "No One", "Me"], correct: 2 },
    { q: "What factor always shock us that helps our relation 🤯?", options: ["imagination", "Timing ⏰", "Same caste"], correct: 1 },
    { q: "Who has the lower IQ 😂🧠?", options: ["You", "No One", "Obviously Me(Yedi Sanviii..😂)"], correct: 2 },
    {
        q: "Who is the most Smartest, Sweetest, Cutest, person u ever met ?😁😎",
        options: [
            "Your Future Husband ( ik its me 😁 )",
            "Your BF( its also me 😂)",
            "Your frnd (its also me 😜)"
        ],
        correct: 0
    }
];

let curQ = 0;

function startQuiz() {
    curQ = 0;
    loadQ();
}

function loadQ() {
    const data = quizData[curQ];
    document.getElementById('currentQuestion').innerText = data.q;
    const optDiv = document.getElementById('quizOptions');
    optDiv.innerHTML = "";

    data.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.style.width = "100%";
        btn.style.margin = "5px 0";

        btn.onclick = () => {
            if (i === data.correct) {
                btn.style.background =
                    'linear-gradient(45deg, #28a745, #20c997)';
                btn.innerHTML = opt + ' ✅';

                setTimeout(() => {
                    curQ++;
                    if (curQ < quizData.length) {
                        loadQ();
                    } else {
                        document.getElementById('quiz-content').innerHTML = `
                            <div style="text-align:center;padding:20px;">
                                <h2 style="color:#ff4d6d;">🎉 Yay! You passed! ❤️</h2>
                                <p>You know me so well! 😍</p>
                            </div>`;
                        createConfetti();
                    }
                }, 1000);
            } else {
                btn.style.background =
                    'linear-gradient(45deg, #dc3545, #fd7e14)';
                btn.innerHTML = opt + ' ❌';
                btn.style.animation = 'shake 0.5s ease-in-out';

                setTimeout(() => {
                    btn.style.background =
                        'linear-gradient(45deg, #ff4d6d, #ff758f)';
                    btn.innerHTML = opt;
                    btn.style.animation = '';
                }, 1000);
            }
        };

        optDiv.appendChild(btn);
    });
}

/* Shake animation */
const shakeKeyframes = `
@keyframes shake {
    0%,100%{transform:translateX(0)}
    25%{transform:translateX(-5px)}
    75%{transform:translateX(5px)}
}`;
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

/* Init */
document.addEventListener('DOMContentLoaded', createFloatingHearts);
