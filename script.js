document.addEventListener("DOMContentLoaded", () => {
    const bird = document.getElementById("bird");
    const game = document.getElementById("game");
    const startScreen = document.getElementById("start-screen");
    const menuContainer = document.getElementById("menu-container");
    const setupBox = document.getElementById("setup-box");
    const nameInput = document.getElementById("name-input");
    const displayName = document.getElementById("display-name");

    let score = 0;
    let highscore = localStorage.getItem("maxinneBest") || 0;
    let gameStarted = false;
    let isGameOver = false;
    let birdTop = 250;
    let velocity = 0;
    let gravity = 0.15; 
    let jumpStrength = -4.2; 
    let playerName = "Guest";

    document.getElementById("best-text").innerText = "Best: " + highscore;

    nameInput.addEventListener("input", () => {
        displayName.innerText = nameInput.value.trim() || "Guest";
    });

    document.getElementById("start-btn").onclick = () => {
        menuContainer.classList.add("hidden");
        setupBox.classList.remove("hidden");
        setTimeout(() => nameInput.focus(), 100);
    };

    document.getElementById("btn-save-name").onclick = () => {
        playerName = nameInput.value.trim() || "Guest";
        startGame();
    };

    function startGame() {
        startScreen.classList.add("hidden");
        document.getElementById("ui-layer").classList.remove("hidden");
        gameStarted = true;
        velocity = jumpStrength;
        seedNumbers("1.00", "glowing-green");
        setInterval(createPipe, 2200);
        requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
        if (!gameStarted || isGameOver) return;
        velocity += gravity;
        birdTop += velocity;
        bird.style.top = birdTop + "px";

        // Tilting effect
        let rotation = Math.min(Math.max(velocity * 4, -20), 70);
        bird.style.transform = `rotate(${rotation}deg)`;

        if (birdTop > 540 || birdTop < 0) endGame();
        requestAnimationFrame(gameLoop);
    }

    // Controls
    window.onkeydown = (e) => { if(e.code === "Space") velocity = jumpStrength; };
    game.onmousedown = (e) => { e.preventDefault(); velocity = jumpStrength; };

    function createPipe() {
        if (!gameStarted || isGameOver) return;
        const gap = 210;
        const topH = Math.random() * 250 + 50;
        let left = 800;
        const tp = document.createElement("div"); tp.className = "pipe";
        const bp = document.createElement("div"); bp.className = "pipe";
        tp.style.height = topH + "px"; tp.style.top = "0";
        bp.style.height = (600 - topH - gap) + "px"; bp.style.bottom = "0";
        [tp, bp].forEach(p => { p.style.left = left + "px"; game.appendChild(p); });

        let scored = false;
        const move = setInterval(() => {
            if (isGameOver) { clearInterval(move); return; }
            left -= 2.8;
            tp.style.left = bp.style.left = left + "px";
            if (left < 165 && left > 35) {
                if (birdTop < topH || birdTop + 65 > topH + gap) endGame();
            }
            if (left < 100 && !scored) {
                score++; scored = true;
                document.getElementById("score-text").innerText = "Score: " + score;
                checkMode();
            }
            if (left < -100) { clearInterval(move); tp.remove(); bp.remove(); }
        }, 16);
    }

    function checkMode() {
        if (Math.floor(score/10) % 2 === 1) {
            game.classList.add("night-mode"); bird.className = "bird demon"; 
            seedNumbers("5.00", "glowing-red");
        } else {
            game.classList.remove("night-mode"); bird.className = "bird angel"; 
            seedNumbers("1.00", "glowing-green");
        }
    }

    function seedNumbers(val, glowClass) {
        const layer = document.getElementById("number-layer");
        layer.innerHTML = "";
        for(let i=0; i<12; i++) {
            const s = document.createElement("span"); 
            s.className = `floating-number ${glowClass}`; 
            s.innerText = val;
            s.style.top = Math.random()*500 + "px"; 
            s.style.left = Math.random()*800 + "px";
            s.style.animationDelay = Math.random()*5 + "s";
            layer.appendChild(s);
        }
    }

    function endGame() {
        if (isGameOver) return;
        isGameOver = true;
        if (score > highscore) localStorage.setItem("maxinneBest", score);
        alert("GAME OVER, " + playerName + "!\nScore: " + score);
        location.reload();
    }

    document.querySelectorAll(".back-btn").forEach(btn => {
        btn.onclick = () => {
            [setupBox, document.getElementById("home-leaderboard"), document.getElementById("credits-section")].forEach(el => el.classList.add("hidden"));
            menuContainer.classList.remove("hidden");
        };
    });
});
