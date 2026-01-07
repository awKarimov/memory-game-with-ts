const starterPage = document.querySelector(".starter-page") as HTMLDivElement;
const gamePage = document.querySelector(".game-page") as HTMLDivElement;
const startBtn = document.querySelector(".start-game") as HTMLButtonElement;

const gameBoard = document.querySelector(".game-board") as HTMLDivElement;
const elMoves = document.getElementById("moves") as HTMLSpanElement;
const elTime = document.getElementById("time") as HTMLSpanElement;

const restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;
const newGameBtn = document.getElementById("newGameBtn") as HTMLButtonElement;

const themeButtons = document.querySelectorAll(
  ".theme .btns"
) as NodeListOf<HTMLButtonElement>;
const playerButtons = document.querySelectorAll(
  ".number-of-players .btns"
) as NodeListOf<HTMLButtonElement>;
const gridButtons = document.querySelectorAll(
  ".grid-size .btns"
) as NodeListOf<HTMLButtonElement>;

function setActive(buttons: NodeListOf<HTMLButtonElement>) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("activeBtn"));
      btn.classList.add("activeBtn");
    });
  });
}

setActive(themeButtons);
setActive(playerButtons);
setActive(gridButtons);

themeButtons[0].classList.add("activeBtn");
playerButtons[0].classList.add("activeBtn");
gridButtons[0].classList.add("activeBtn");

let firstCard: HTMLDivElement | null = null;
let secondCard: HTMLDivElement | null = null;
let lockBoard = false;

let firstValue: string | number | null = null;
let secondValue: string | number | null = null;

let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timer: number;

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    elTime.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

function getGridSize(): string {
  return document.querySelector(".grid-size .activeBtn")!.textContent || "4x4";
}

function getPairCount(): number {
  return getGridSize() === "6x6" ? 18 : 8;
}

function setGridColumns() {
  gameBoard.style.gridTemplateColumns =
    getGridSize() === "6x6" ? "repeat(6, 1fr)" : "repeat(4, 1fr)";
}

function generateNumbers(): number[] {
  const pairCount = getPairCount();
  const nums: number[] = [];

  while (nums.length < pairCount) {
    const n = Math.floor(Math.random() * 99) + 1;
    if (!nums.includes(n)) nums.push(n);
  }

  return [...nums, ...nums];
}

function generateIcons(): string[] {
  const pairCount = getPairCount();

  const icons = [
    "bitcoin.svg",
    "car.svg",
    "cloud.svg",
    "css.svg",
    "euro.svg",
    "folder.svg",
    "html.svg",
    "laptop.svg",
    "man.svg",
    "money.svg",
    "moon.svg",
    "send.svg",
    "shape.svg",
    "shape2.svg",
    "sun.svg",
    "thunder.svg",
    "washing-machine.svg",
    "wifi.svg",
  ];

  const selectedIcons = icons.slice(0, pairCount);

  return [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
}

function generateCards() {
  gameBoard.innerHTML = "";

  moves = 0;
  seconds = 0;
  matchedPairs = 0;

  elMoves.textContent = "0";
  elTime.textContent = "0:00";

  setGridColumns();

  const theme = document.querySelector(".theme .activeBtn")!.textContent;
  const values = theme === "Icons" ? generateIcons() : generateNumbers();

  values.forEach((value) => {
    const card = document.createElement("div") as HTMLDivElement;
    card.classList.add("card");

    const img = document.createElement("img") as HTMLImageElement;
    img.src = "/img/close-circle.svg";

    const span = document.createElement("span") as HTMLSpanElement;

    card.appendChild(img);
    card.appendChild(span);

    card.addEventListener("click", () => flipCard(card, value));
    gameBoard.appendChild(card);
  });
}

function flipCard(card: HTMLDivElement, value: string | number) {
  if (lockBoard) return;
  if (card === firstCard) return;

  openCard(card, value);

  if (!firstCard) {
    firstCard = card;
    firstValue = value;
    return;
  }

  secondCard = card;
  secondValue = value;
  lockBoard = true;

  moves++;
  elMoves.textContent = moves.toString();

  checkMatch();
}

function openCard(card: HTMLDivElement, value: string | number) {
  const theme = document.querySelector(".theme .activeBtn")!.textContent;

  const img = card.querySelector("img") as HTMLImageElement;
  const span = card.querySelector("span") as HTMLSpanElement;

  if (theme === "Icons") {
    img.src = `/img/${value}`;
    span.textContent = "";
  } else {
    span.textContent = value.toString();
    img.src = "/img/open-circle.svg";
  }
}

function closeCard(card: HTMLDivElement) {
  const theme = document.querySelector(".theme .activeBtn")!.textContent;

  const img = card.querySelector("img") as HTMLImageElement;
  const span = card.querySelector("span") as HTMLSpanElement;

  if (theme === "Icons") {
    img.src = "/img/close-circle.svg";
  } else {
    img.src = "/img/close-circle.svg";
    span.textContent = "";
  }
}

function checkMatch() {
  if (firstValue === secondValue) {
    matchedPairs++;
    resetTurn();
    checkWin();
  } else {
    setTimeout(() => {
      if (firstCard && secondCard) {
        closeCard(firstCard);
        closeCard(secondCard);
      }
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  firstValue = null;
  secondValue = null;
  lockBoard = false;
}

function checkWin() {
  if (matchedPairs === getPairCount()) {
    stopTimer();
    setTimeout(() => {
      alert(
        `🎉 Siz yutdingiz!
        
        Moves: ${moves}
        Time: ${elTime.textContent}`
      );
    }, 300);
  }
}

startBtn.addEventListener("click", () => {
  starterPage.classList.add("slide-up");

  setTimeout(() => {
    starterPage.style.display = "none";
    gamePage.classList.remove("hidden");

    generateCards();
    stopTimer();

    const ready = confirm("Are you ready?");
    if (ready) startTimer();
  }, 600);
});

restartBtn.addEventListener("click", () => {
  if (!confirm("O`yinni qaytadan boshlamoqchimisiz?")) return;

  stopTimer();
  generateCards();
  startTimer();
});

newGameBtn.addEventListener("click", () => {
  const ok = confirm("Yangi o'yin boshlamoqchimisiz?");
  if (!ok) return;

  stopTimer();
  gamePage.classList.add("hidden");

  starterPage.style.display = "flex";
  starterPage.classList.remove("hidden");
  starterPage.classList.remove("slide-up");
});
