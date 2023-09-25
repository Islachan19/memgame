const cardContainer = document.getElementById("cardContainer");
const cards = cardContainer.children;
let firstCard = null;
let secondCard = null;
let gameStarted = false;
let timeInterval;
let elapsedTime = 0;
let matchedPairs = 0;
let totalPairs = 25;

function reloadPage() {
    location.reload();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleCards() {
    const cardArray = Array.from(cards);
    shuffleArray(cardArray);
    cardArray.forEach((card, index) => {
        cardContainer.appendChild(card);
    });
}

function startGame() {
    const background = document.getElementById("background");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const bgm = document.getElementById("backgroundMusic");
    const nameButtons = document.getElementsByClassName("nameButton");

    for (let i = 0; i < nameButtons.length; i++) {
        nameButtons[i].disabled = true;
        nameButtons[i].style.cursor = "not-allowed";
    }

    background.classList.add("gameStart");
    stopButton.style.display = "block";
    startButton.style.display = "none";
    startButton.disabled = true;
    gameStarted = true;
    bgm.volume = 0.4;
    bgm.play();

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.cursor = "pointer";
    }

    startTimer();
}

function checkIfMatch() {
    if (firstCard && secondCard) {
        if (firstCard.classList[1] === secondCard.classList[1]) {
            const matchSound = document.getElementById("matchSound");

            matchSound.currentTime = 0;
            matchSound.play();
            firstCard.classList.add("matched")
            secondCard.classList.add("matched");
            firstCard.style.cursor = "not-allowed";
            secondCard.style.cursor = "not-allowed";
            firstCard.style.opacity = "0.2";
            secondCard.style.opacity = "0.2";
            firstCard = null;
            secondCard = null;
            matchedPairs++;

            if (matchedPairs === totalPairs) {
                finishGame();
            }

        } else {
            let tempFirstCard = firstCard;
            let tempSecondCard = secondCard;

            setTimeout(() => {
                tempFirstCard.classList.toggle("flipped");
                tempSecondCard.classList.toggle("flipped");
                tempFirstCard = null;
                tempSecondCard = null;
            }, 700);
            firstCard = null;
            secondCard = null;
        }
    }
}

function flipCard(clickedCard) {
    if (!gameStarted || clickedCard.classList.contains("matched") || clickedCard.classList.contains("flipped")) {
        return;
    }

    const clickSound = document.getElementById("clickSound");

    clickSound.currentTime = 0;
    clickSound.play();
    clickedCard.classList.toggle("flipped");

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        checkIfMatch();
    }
}

function flipEntireBoard() {
    const entireBoard = document.getElementById("fullBox");

    entireBoard.classList.toggle("winCondition");
}

function startTimer() {
    const timerCounter = document.getElementById("timerCounter");

    timerCounter.textContent = "00:00";

    if (gameStarted) {
        timerInterval = setInterval(() => {
            elapsedTime++;

            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;

            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

            timerCounter.textContent = `${formattedMinutes}:${formattedSeconds}`;
        }, 1000);
    }
}

function stopGame() {
    clearInterval(timerInterval);

    const background = document.getElementById("background");
    const bgm = document.getElementById("backgroundMusic");
    const stopButton = document.getElementById("stop");
    const loseSound = document.getElementById("loseSound");
    const winText = document.getElementById("winText");
    const nameButtons = document.getElementsByClassName("nameButton");

    for (let i = 0; i < nameButtons.length; i++) {
        nameButtons[i].disabled = false;
        nameButtons[i].style.cursor = "pointer";
    }

    background.classList.remove("gameStart");
    bgm.pause();
    bgm.currentTime = 0;
    stopButton.classList.add("disabled");
    stopButton.disabled = true;
    loseSound.play();

    if (matchedPairs === 0 && elapsedTime === 0) {
        winText.innerHTML = "You didn't even play.";
    } else if (matchedPairs === 1 && elapsedTime === 1) {
        winText.innerHTML = "Game Over. You lasted <span class='textHighlight'>" + elapsedTime + "</span> second and found <span class='textHighlight'>" + matchedPairs + "</span> match out of 25. Would you like to try again?";
    } else if (matchedPairs !== 0 && matchedPairs !== 1 && elapsedTime === 1) {
        winText.innerHTML = "Game Over. You lasted <span class='textHighlight'>" + elapsedTime + "</span> second and found <span class='textHighlight'>" + matchedPairs + "</span> matches out of 25. Would you like to try again?";
    } else if (matchedPairs === 1 && elapsedTime !== 0) {
        winText.innerHTML = "Game Over. You lasted <span class='textHighlight'>" + elapsedTime + "</span> seconds and found <span class='textHighlight'>" + matchedPairs + "</span> match out of 25. Would you like to try again?";
    } else if (matchedPairs === 0 && elapsedTime !== 0) {
        winText.innerHTML = "Game Over. You did not find any matches. Would you like to try again?"
    } else {
        winText.innerHTML = "Game Over. You lasted <span class='textHighlight'>" + elapsedTime + "</span> seconds and found <span class='textHighlight'>" + matchedPairs + "</span> matches out of 25. Would you like to try again?";
    }
    flipEntireBoard();
}

function updateLeaderboard(leaderboardData) {
    const leaderboardInfo = document.querySelector(".leaderboardInfo");

    leaderboardInfo.innerHTML = "";

    leaderboardData.forEach((player, index) => {

        const leaderboardEntry = document.createElement("button");
        const playerPositionSpan = document.createElement("span");
        playerPositionSpan.textContent = `${index + 1}. `;
        playerPositionSpan.className = "position";

        const playerNameSpan = document.createElement("span");

        playerNameSpan.textContent = player.name;
        leaderboardEntry.appendChild(playerPositionSpan);
        leaderboardEntry.appendChild(playerNameSpan);

        const minutes = Math.floor(player.time / 60);
        const seconds = player.time % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        leaderboardEntry.innerHTML += ` - ${formattedMinutes}:${formattedSeconds}`;
        leaderboardEntry.classList.add("nameButton");
        leaderboardEntry.addEventListener("click", () => {
            alert(`Contact Number: ${player.number}`);
        });
        leaderboardInfo.appendChild(leaderboardEntry);
    });
}


function finishGame() {
    clearInterval(timerInterval);

    const background = document.getElementById("background");
    const stopButton = document.getElementById("stop");
    const bgm = document.getElementById("backgroundMusic");
    const winSound = document.getElementById("winSound");
    const nameButtons = document.getElementsByClassName("nameButton");
    const highscoreElement = document.querySelector(".highscore");

    for (let i = 0; i < nameButtons.length; i++) {
        nameButtons[i].disabled = false;
        nameButtons[i].style.cursor = "pointer";
    }

    background.classList.remove("gameStart");
    stopButton.classList.add("disabled");
    stopButton.disabled = true;
    bgm.pause();
    bgm.currentTime = 0;
    winSound.play();

    setTimeout(() => {
        alert("You Win!");
        let playerName = prompt("Please Enter Your Name:");
        let playerNumber = prompt("Please Enter Your Contact Number:");

        if (playerName === "") {
            playerName = "Anonymous";
        }

        if (playerNumber === "") {
            playerNumber = "Anonymous";
        }
        
        const winText = document.getElementById("winText");

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        winText.innerHTML = "Congratulations <span class='textHighlight'>" + playerName + "</span>. You won in <span class='textHighlight'>" + formattedMinutes + ":" + formattedSeconds + "</span>. Would you like to try again?";
        flipEntireBoard();
        
        let leaderboardData = [];
        const storedLeaderboard = localStorage.getItem("leaderboard");
        
        if (storedLeaderboard) {
            leaderboardData = JSON.parse(storedLeaderboard);
        }
        
        leaderboardData.push({
            name: playerName,
            time: elapsedTime,
            number: playerNumber
        });

        leaderboardData.sort((a, b) => a.time - b.time);
        leaderboardData = leaderboardData.slice(0, 5);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));

        updateLeaderboard(leaderboardData);

        const highestScorer = leaderboardData[0];
        const highestMinutes = Math.floor(highestScorer.time / 60);
        const highestSeconds = highestScorer.time % 60;

        const formattedHighestMinutes = highestMinutes < 10 ? `0${highestMinutes}` : highestMinutes;

        highscoreElement.textContent = `Highscore: ${formattedHighestMinutes}:${highestSeconds}`;
        localStorage.setItem("highscoreTime", highestScorer.time);
    }, 1500);
}

window.onload = function () {
    const storedLeaderboard = localStorage.getItem("leaderboard");

    if (storedLeaderboard) {
        const leaderboardData = JSON.parse(storedLeaderboard);

        updateLeaderboard(leaderboardData);
    }

    const highscoreTime = localStorage.getItem("highscoreTime");

    if (highscoreTime) {
        const highscoreElement = document.querySelector(".highscore");

        const highscoreMinutes = Math.floor(highscoreTime / 60);
        const highscoreSeconds = highscoreTime % 60;

        const formattedHighscoreMinutes = highscoreMinutes < 10 ? `0${highscoreMinutes}` : highscoreMinutes;

        highscoreElement.textContent = `Highscore: ${formattedHighscoreMinutes}:${highscoreSeconds}`;
    }
    shuffleCards();
};