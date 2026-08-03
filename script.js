const QUESTIONS_PER_SET = 20;
const CONFETTI_EMOJI = ["🎉", "⭐", "✨", "🎊", "💫"];

const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const scoreLabel = document.getElementById("score-label");
const streakLabel = document.getElementById("streak-label");
const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackText = document.getElementById("feedback-text");
const nextBtn = document.getElementById("next-btn");
const resultsTitle = document.getElementById("results-title");
const resultsSummary = document.getElementById("results-summary");
const resultsMessage = document.getElementById("results-message");
const starsEl = document.getElementById("stars");
const confettiLayer = document.getElementById("confetti-layer");

let currentMode = null;
let questions = [];
let questionIndex = 0;
let score = 0;
let streak = 0;

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeTimesQuestion() {
  const a = randomInt(1, 12);
  const b = randomInt(1, 12);
  return { text: `${a} × ${b} = ?`, answer: a * b };
}

function makeSubtractionQuestion() {
  const a = randomInt(1, 50);
  const b = randomInt(1, a);
  return { text: `${a} - ${b} = ?`, answer: a - b };
}

function makeDivisionQuestion() {
  const divisor = randomInt(1, 12);
  const quotient = randomInt(1, 12);
  const dividend = divisor * quotient;
  return { text: `${dividend} ÷ ${divisor} = ?`, answer: quotient };
}

function makePercentageQuestion() {
  const percents = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
  const percent = percents[randomInt(0, percents.length - 1)];
  const step = 100 / gcd(percent, 100);
  const base = step * randomInt(1, 20);
  const answer = (percent * base) / 100;
  return { text: `What is ${percent}% of ${base}?`, answer };
}

const generators = {
  times: makeTimesQuestion,
  subtraction: makeSubtractionQuestion,
  division: makeDivisionQuestion,
  percentages: makePercentageQuestion,
};

function makeMixedQuestion() {
  const keys = Object.keys(generators);
  const key = keys[randomInt(0, keys.length - 1)];
  return generators[key]();
}

function generateQuestions(mode) {
  const generator = mode === "mixed" ? makeMixedQuestion : generators[mode];
  const set = [];
  for (let i = 0; i < QUESTIONS_PER_SET; i++) {
    set.push(generator());
  }
  return set;
}

function showScreen(screen) {
  [homeScreen, quizScreen, resultsScreen].forEach((s) => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function startQuiz(mode) {
  currentMode = mode;
  questions = generateQuestions(mode);
  questionIndex = 0;
  score = 0;
  streak = 0;
  streakLabel.classList.add("hidden");
  showScreen(quizScreen);
  showQuestion();
}

function updateProgressBar() {
  const percent = ((questionIndex + 1) / QUESTIONS_PER_SET) * 100;
  progressFill.style.width = `${percent}%`;
}

function showQuestion() {
  const q = questions[questionIndex];
  progressLabel.textContent = `Question ${questionIndex + 1}/${QUESTIONS_PER_SET}`;
  scoreLabel.textContent = `Score: ${score}`;
  updateProgressBar();
  questionText.textContent = q.text;
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  feedbackText.classList.add("hidden");
  feedbackText.classList.remove("correct", "wrong");
  nextBtn.classList.add("hidden");
  answerInput.focus();
}

function spawnConfetti() {
  const pieceCount = 18;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = CONFETTI_EMOJI[randomInt(0, CONFETTI_EMOJI.length - 1)];
    piece.style.left = `${randomInt(0, 100)}%`;
    piece.style.animationDuration = `${(Math.random() * 1 + 1.2).toFixed(2)}s`;
    piece.style.fontSize = `${randomInt(14, 26)}px`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function triggerShake() {
  questionBox.classList.remove("shake");
  void questionBox.offsetWidth;
  questionBox.classList.add("shake");
}

function pulseStreak() {
  streakLabel.classList.remove("pulse");
  void streakLabel.offsetWidth;
  streakLabel.classList.add("pulse");
}

function submitAnswer(event) {
  event.preventDefault();
  if (answerInput.value === "") return;

  const q = questions[questionIndex];
  const userAnswer = Number(answerInput.value);
  const isCorrect = userAnswer === q.answer;

  if (isCorrect) {
    score++;
    streak++;
    feedbackText.textContent = "Correct! 🎉";
    feedbackText.classList.add("correct");
    spawnConfetti();
    if (streak >= 2) {
      streakLabel.textContent = `🔥 ${streak}`;
      streakLabel.classList.remove("hidden");
      pulseStreak();
    }
  } else {
    streak = 0;
    streakLabel.classList.add("hidden");
    feedbackText.textContent = `Not quite. The answer is ${q.answer}.`;
    feedbackText.classList.add("wrong");
    triggerShake();
  }

  feedbackText.classList.remove("hidden");
  answerInput.disabled = true;
  submitBtn.disabled = true;
  scoreLabel.textContent = `Score: ${score}`;

  const isLastQuestion = questionIndex === QUESTIONS_PER_SET - 1;
  nextBtn.textContent = isLastQuestion ? "See Results →" : "Next Question →";
  nextBtn.classList.remove("hidden");
  nextBtn.focus();
}

function goToNext() {
  questionIndex++;
  if (questionIndex >= QUESTIONS_PER_SET) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  showScreen(resultsScreen);
  resultsSummary.textContent = `You got ${score} out of ${QUESTIONS_PER_SET} correct!`;

  let starCount;
  let title;
  let message;
  if (score >= 18) {
    starCount = 3;
    title = "Amazing! 🏆";
    message = "You're a math superstar!";
    spawnConfetti();
    setTimeout(spawnConfetti, 300);
  } else if (score >= 14) {
    starCount = 2;
    title = "Great Job! 🌟";
    message = "Nice work, keep it up!";
    spawnConfetti();
  } else if (score >= 8) {
    starCount = 1;
    title = "Good Effort! 👍";
    message = "Practice makes perfect, try again!";
  } else {
    starCount = 0;
    title = "Set Complete!";
    message = "Keep practicing, you'll get there!";
  }

  resultsTitle.textContent = title;
  resultsMessage.textContent = message;
  starsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.textContent = i < starCount ? "★" : "☆";
    if (i < starCount) star.classList.add("lit");
    starsEl.appendChild(star);
  }
}

document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => startQuiz(btn.dataset.mode));
});

answerForm.addEventListener("submit", submitAnswer);
nextBtn.addEventListener("click", goToNext);
document.getElementById("retry-btn").addEventListener("click", () => startQuiz(currentMode));
document.getElementById("home-btn").addEventListener("click", () => showScreen(homeScreen));
