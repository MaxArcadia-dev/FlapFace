document.addEventListener("DOMContentLoaded", function () {
    const bird = document.getElementById("bird");
    const game = document.getElementById("game");
    const scoreDisplay = document.getElementById("score");
    const startScreen = document.getElementById("start-screen");

    let birdTop = 250;
    let gravity = 2.5;
    let isGameOver = false;
    let gameStarted = false;
    let score = 0;
    const birdHeight = 80;
    const gameWidth = 800;

    // 1. Gravity Logic
    function applyGravity() {
        if (isGameOver || !gameStarted) return;
        birdTop += gravity;
        bird.style.top = birdTop + "px";

        if (birdTop >= 600 - birdHeight) {
            endGame();
        }
    }
    setInterval(applyGravity, 20);

    // 2. Start & Jump Controls
    function handleAction() {
        if (isGameOver) return;

        if (!gameStarted) {
            gameStarted = true;
            startScreen.style.display = "none";
            // Start spawning pipes only after first click
            setInterval(createPipe, 1500);
        }

        birdTop -= 70; // Jump power
        if (birdTop < 0) birdTop = 0;
        bird.style.top = birdTop + "px";
    }

    document.addEventListener("keydown", function(e) {
        if (e.code === "Space" || e.code === "ArrowUp") handleAction();
    });
    document.addEventListener("mousedown", handleAction);

    // 3. Pipe Logic
    function createPipe() {
        if (isGameOver) return;

        const pipeGap = 220; 
        const pipeTopHeight = Math.floor(Math.random() * 250) + 50;
        const pipeBottomHeight = 600 - pipeTopHeight - pipeGap;

        const topPipe = document.createElement("div");
        const bottomPipe = document.createElement("div");

        topPipe.classList.add("pipe", "top-pipe");
        bottomPipe.classList.add("pipe", "bottom-pipe");

        topPipe.style.height = pipeTopHeight + "px";
        topPipe.style.left = gameWidth + "px";
        bottomPipe.style.height = pipeBottomHeight + "px";
        bottomPipe.style.left = gameWidth + "px";

        game.appendChild(topPipe);
        game.appendChild(bottomPipe);

        let pipeLeft = gameWidth;
        let scored = false;

        const movePipe = setInterval(function () {
            if (isGameOver) {
                clearInterval(movePipe);
                return;
            }

            pipeLeft -= 5;
            topPipe.style.left = pipeLeft + "px";
            bottomPipe.style.left = pipeLeft + "px";

            // Collision Detection (Bird is at Left: 100px)
            if (
                pipeLeft < (100 + birdHeight) && pipeLeft > (100 - 80) && 
                (birdTop < pipeTopHeight || birdTop + birdHeight > pipeTopHeight + pipeGap)
            ) {
                endGame();
            }

            // Scoring
            if (!scored && pipeLeft < 100) {
                score++;
                scored = true;
                scoreDisplay.textContent = "Score: " + score;
            }

            if (pipeLeft < -100) {
                clearInterval(movePipe);
                topPipe.remove();
                bottomPipe.remove();
            }
        }, 20);
    }

    function endGame() {
        isGameOver = true;
        alert("Game Over! Score: " + score);
        location.reload();
    }
});