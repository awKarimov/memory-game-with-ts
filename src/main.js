var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var starterPage = document.querySelector(".starter-page");
var gamePage = document.querySelector(".game-page");
var startBtn = document.querySelector(".start-game");
var gameBoard = document.querySelector(".game-board");
var elMoves = document.getElementById("moves");
var elTime = document.getElementById("time");
var restartBtn = document.getElementById("restartBtn");
var newGameBtn = document.getElementById("newGameBtn");
var themeButtons = document.querySelectorAll(".theme .btns");
var playerButtons = document.querySelectorAll(".number-of-players .btns");
var gridButtons = document.querySelectorAll(".grid-size .btns");
function setActive(buttons) {
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            buttons.forEach(function (b) { return b.classList.remove("activeBtn"); });
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
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var firstValue = null;
var secondValue = null;
var matchedPairs = 0;
var moves = 0;
var seconds = 0;
var timer;
function startTimer() {
    timer = setInterval(function () {
        seconds++;
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        elTime.textContent = "".concat(min, ":").concat(sec < 10 ? "0" + sec : sec);
    }, 1000);
}
function stopTimer() {
    if (timer)
        clearInterval(timer);
}
function getGridSize() {
    return document.querySelector(".grid-size .activeBtn").textContent || "4x4";
}
function getPairCount() {
    return getGridSize() === "6x6" ? 18 : 8;
}
function setGridColumns() {
    gameBoard.style.gridTemplateColumns =
        getGridSize() === "6x6" ? "repeat(6, 1fr)" : "repeat(4, 1fr)";
}
function generateNumbers() {
    var pairCount = getPairCount();
    var nums = [];
    while (nums.length < pairCount) {
        var n = Math.floor(Math.random() * 99) + 1;
        if (!nums.includes(n))
            nums.push(n);
    }
    return __spreadArray(__spreadArray([], nums, true), nums, true);
}
function generateIcons() {
    var pairCount = getPairCount();
    var icons = [
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
    var selectedIcons = icons.slice(0, pairCount);
    return __spreadArray(__spreadArray([], selectedIcons, true), selectedIcons, true).sort(function () { return Math.random() - 0.5; });
}
function generateCards() {
    gameBoard.innerHTML = "";
    moves = 0;
    seconds = 0;
    matchedPairs = 0;
    elMoves.textContent = "0";
    elTime.textContent = "0:00";
    setGridColumns();
    var theme = document.querySelector(".theme .activeBtn").textContent;
    var values = theme === "Icons" ? generateIcons() : generateNumbers();
    values.forEach(function (value) {
        var card = document.createElement("div");
        card.classList.add("card");
        var img = document.createElement("img");
        img.src = "/img/close-circle.svg";
        var span = document.createElement("span");
        card.appendChild(img);
        card.appendChild(span);
        card.addEventListener("click", function () { return flipCard(card, value); });
        gameBoard.appendChild(card);
    });
}
function flipCard(card, value) {
    if (lockBoard)
        return;
    if (card === firstCard)
        return;
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
function openCard(card, value) {
    var theme = document.querySelector(".theme .activeBtn").textContent;
    var img = card.querySelector("img");
    var span = card.querySelector("span");
    if (theme === "Icons") {
        img.src = "/img/".concat(value);
        span.textContent = "";
    }
    else {
        span.textContent = value.toString();
        img.src = "/img/open-circle.svg";
    }
}
function closeCard(card) {
    var theme = document.querySelector(".theme .activeBtn").textContent;
    var img = card.querySelector("img");
    var span = card.querySelector("span");
    if (theme === "Icons") {
        img.src = "/img/close-circle.svg";
    }
    else {
        img.src = "/img/close-circle.svg";
        span.textContent = "";
    }
}
function checkMatch() {
    if (firstValue === secondValue) {
        matchedPairs++;
        resetTurn();
        checkWin();
    }
    else {
        setTimeout(function () {
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
        setTimeout(function () {
            alert("\uD83C\uDF89 Siz yutdingiz!\n        \n        Moves: ".concat(moves, "\n        Time: ").concat(elTime.textContent));
        }, 300);
    }
}
startBtn.addEventListener("click", function () {
    starterPage.classList.add("slide-up");
    setTimeout(function () {
        starterPage.style.display = "none";
        gamePage.classList.remove("hidden");
        generateCards();
        stopTimer();
        var ready = confirm("Are you ready?");
        if (ready)
            startTimer();
    }, 600);
});
restartBtn.addEventListener("click", function () {
    var ok = confirm("Restart qilmoqchimisiz?");
    if (!ok)
        return;
    stopTimer();
    generateCards();
    startTimer();
});
newGameBtn.addEventListener("click", function () {
    var ok = confirm("New game boshlamoqchimisiz?");
    if (!ok)
        return;
    stopTimer();
    gamePage.classList.add("hidden");
    starterPage.style.display = "flex";
    starterPage.classList.remove("hidden");
    starterPage.classList.remove("slide-up");
});
