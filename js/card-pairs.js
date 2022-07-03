var flippedPairs = 0;
var flippedCards = [];

var minutes = 0;
var seconds = 0;
var tens = 0;
var timer;
var timerStarted = false;

// Create card div
function makecard(cardType) {
    return  `<div class="card">
                <div class="card-inner" id="${cardType}-inner">
                    <div class="card-front"></div>
                    <div class="card-back" id="${cardType}">
                        <img src="/img/${cardType}.png" alt="" draggable="false">
                    </div>
                </div>
            </div>`;
}


// Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Add the board
function initializeBoard() {
    flippedPairs = 0;
    flippedCards = [];

    $(document).ready(() => {
        $(".board").html("");

        var cards = ["node", "node", "react", "react", "javascript", "javascript", "angular", "angular", "html", "html"];
        shuffleArray(cards);

        for (let index = 0; index < cards.length; index++) {
            $(".board").append(makecard(cards[index]));
        }
    });
}


// Remove Modal
function removeModal() {
    document.getElementsByClassName("start-modal-content")[0].style.top = "-50%";
    setTimeout(() => document.getElementsByClassName("start-modal")[0].style.display = "none", 500);
}


function replay() {
    var cards = $(".card-inner");
    document.getElementsByClassName("win-modal")[0].style.display = "none";

    [...cards].forEach((card) => {
        card.classList.remove('is-flipped');
    });

    setTimeout(() => {
        initialize();
        resetTimer();
    }, 300);
}


// Initialize the game
function initialize() {
    initializeBoard();

    // Add 'flip' event handler
    $(document).ready(() => {
        var cards = $(".card-front");

        [...cards].forEach((card) => {
            card.addEventListener( 'click', function() {
                // Start timer when first card is flipped
                if (!timerStarted) {
                    startTimer();
                    timerStarted = true;
                }

                card.parentElement.classList.toggle('is-flipped');
                flippedCards.unshift(card.parentElement);

                if (flippedCards.length == 2) {
                    // Disable other cards from flipping before the animation ends.
                    [...cards].forEach((card) => {
                        card.style.pointerEvents = "none";
                    });

                    if (flippedCards[0].id == flippedCards[1].id) {
                        flippedPairs++;

                        if (flippedPairs == 5) {
                            updateScoreboard();
                            document.getElementsByClassName("win-modal")[0].style.display = "block";
                            clearInterval(timer);
                        }
                    } else {
                        // Unflip the wrong pairs (do it after it's flipped)
                        setTimeout(() => {
                            flippedCards.forEach(element => {
                                element.classList.remove('is-flipped');
                            });
                        }, 400);
                    }

                    setTimeout(() => {
                        flippedCards = [];

                        // Enable flipping again
                        [...cards].forEach((card) => {
                            card.style.pointerEvents = "auto";
                        });
                    }, 450);
                }
            });
        });
    });
}


// Start timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(incrementTimer, 10);
}


// Stop Timer
function stopTimer() {
    clearInterval(timer);
}


// Reset Timer
function resetTimer() {
    minutes = 0;
    seconds = 0;
    tens = 0;
    timerStarted = false;

    document.getElementById("tens").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
}


// Increment Timer
function incrementTimer() {
    tens++;

    if (tens <= 9) {
        document.getElementById("tens").innerHTML = "0" + tens;
    }

    if (tens > 9){
        document.getElementById("tens").innerHTML = tens;
    }

    if (tens > 99) {
        seconds++;
        document.getElementById("seconds").innerHTML = "0" + seconds;
        tens = 0;
        document.getElementById("tens").innerHTML = "00";
    }

    if (seconds > 9) {
        document.getElementById("seconds").innerHTML = seconds;
    }

    if (seconds > 59) {
        minutes++;
        document.getElementById("minutes").innerHTML = "0" + minutes;
        seconds = 0;
        document.getElementById("seconds").innerHTML = "00";
    }

    if (minutes > 9) {
        document.getElementById("minutes").innerHTML = minutes;
    }
}


// Update the Scoreboard (time taken and high score)
function updateScoreboard() {
    var min = minutes.toLocaleString('en-us', {minimumIntegerDigits: 2});
    var sec = seconds.toLocaleString('en-us', {minimumIntegerDigits: 2});
    var ms = tens.toLocaleString('en-us', {minimumIntegerDigits: 2});
    var time = `${min}:${sec}:${ms}`;

    if (compareHighScore(time, localStorage.getItem("highScore"))) {
        localStorage.setItem("highScore", time);
    }

    document.getElementById("time-taken").innerHTML = `Time Taken: ${time}`;
    document.getElementById("high-score").innerHTML = `Your High Score: <br><b>${localStorage.getItem("highScore")}</b>`;
}


// Compare New Time and High Score (return true if new time is faster than high score)
function compareHighScore(newTime, highScore) {
    if (highScore == null) {
        return true;
    } else {
        var newTime = newTime.split(":").map((e) => Number(e));
        var highScore = highScore.split(":").map((e) => Number(e));

        console.log(newTime);
        console.log(highScore);

        if (newTime[0] == highScore[0]) {
            if (newTime[1] == highScore[1]) {
                return newTime[2] < highScore[2];
            } else {
                return newTime[1] < highScore[1];
            }
        } else {
            return newTime[0] < highScore[0];
        }
    }
}

initialize();

$(document).ready(() => {
    document.getElementsByClassName("start-modal-content")[0].style.top = "45%";
});
