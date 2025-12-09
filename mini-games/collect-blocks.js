// collect-blocks.js
let score = 0;
let timeLeft = 30;
let gameInterval = null;
let spawnInterval = null;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-btn");
const endScreen = document.getElementById("end-screen");
const finalScoreEl = document.getElementById("final-score");

// === Функция создания блока ===
function spawnBlock() {
  const block = document.createElement("div");
  block.className = "block";

  // случайное положение
  const x = Math.random() * (gameArea.clientWidth - 40);
  const y = Math.random() * (gameArea.clientHeight - 40);

  block.style.left = `${x}px`;
  block.style.top = `${y}px`;

  // случайный цвет
  block.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 55%)`;

  // обработчик клика
  block.onclick = () => {
    score++;
    scoreEl.textContent = score;
    block.remove();
  };

  gameArea.appendChild(block);

  // блок исчезает через 1.5 сек
  setTimeout(() => block.remove(), 1500);
}

// === Таймер игры ===
function startTimer() {
  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// === Старт игры ===
startBtn.onclick = () => {
  startBtn.style.display = "none";

  spawnInterval = setInterval(spawnBlock, 500);
  startTimer();
};

// === Завершение игры ===
function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  gameArea.innerHTML = "";
  finalScoreEl.textContent = score;

  endScreen.classList.remove("hidden");
}
