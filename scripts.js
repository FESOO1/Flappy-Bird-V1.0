const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', '500px');
canvas.setAttribute('height', '729px');

// GAME
let isGameStarted = false;
let isGameOver = false;

// GAME OVER MENU
let gameOverMenuWidth = canvas.width - 80, gameOverMenuHeight = 80;
let gameOverMenuX = 40, gameOverMenuY = (canvas.height - gameOverMenuHeight) / 2;

// BASE
let baseWidth = canvas.width;
let baseHeight = 100;
let visibleBaseX = 0, visibleBaseY = canvas.height - baseHeight;
let invisibleBaseX = canvas.width, invisibleBaseY = canvas.height - baseHeight;
let baseMoveSpeed = 1;

// BIRD
let birdWidth = 55, birdHeight = 40;
let birdX = (canvas.width - birdWidth) / 2, birdY = (canvas.height - birdHeight) / 2;
let isSpacePressed = false;
let isJumpable = false;
let birdImageState = 0;
let birdVelocity = 0;
let gravity = 0.1;
let jump = -4;

// PIPES
let pipeWidth = 75, pipeHeight = 500;
let pipeMoveSpeed = 1;
const pipePositions = [
    {
        topY: -200,
        bottomY: canvas.height - (pipeHeight / 2),
    },
    {
        topY: -250,
        bottomY: canvas.height - (pipeHeight / 2) - 50,
    },
    {
        topY: -300,
        bottomY: canvas.height - (pipeHeight / 2) - 100,
    },
    {
        topY: -350,
        bottomY: canvas.height - (pipeHeight / 2) - 150,
    },
    {
        topY: -400,
        bottomY: canvas.height - (pipeHeight / 2) - 200,
    },
];
let randomPipePosition = randomPipeFnc();
const pipes = [{ topPipe: { x: canvas.width + 200, y: pipePositions[randomPipePosition].topY }, bottomPipe: { x: canvas.width + 200, y: pipePositions[randomPipePosition].bottomY } }];


// RANDOM PIPE FUNCTION

function randomPipeFnc() {
    return Math.floor(Math.random() * pipePositions.length);
};

// DETECT COLLISION

function detectCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const topPipe = pipes[i].topPipe;
        const topY = -(-pipes[i].topPipe.y - pipeHeight);
        const bottomPipe = pipes[i].bottomPipe;
        const bottomY = pipes[i].bottomPipe.y - (birdHeight / 2);

        // TOP
        if (topPipe.x - birdWidth < birdX && topPipe.x + birdWidth > birdX && topY > birdY) {
            baseMoveSpeed = 0;
            isGameStarted = false;
            isGameOver = true;
        };
        
        // BOTTOM
        if (bottomPipe.x - birdWidth < birdX && bottomPipe.x + birdWidth > birdX && bottomY < birdY + (birdHeight / 2)) {
            baseMoveSpeed = 0;
            isGameStarted = false;
            isGameOver = true;
        };
        
        // BASE
        if (birdY > visibleBaseY - birdHeight) {
            baseMoveSpeed = 0;
            isGameStarted = false;
            isGameOver = true;
        };
    };
};

// DRAW PIPES

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const topPipe = pipes[i].topPipe;
        const bottomPipe = pipes[i].bottomPipe;

        // TOP PIPE
        ctx.beginPath();
        ctx.drawImage(pipeTopImage, topPipe.x, topPipe.y, pipeWidth, pipeHeight);
        ctx.closePath();

        // BOTTOM PIPE
        ctx.beginPath();
        ctx.drawImage(pipeBottomImage, bottomPipe.x, bottomPipe.y, pipeWidth, pipeHeight);
        ctx.closePath();

        if (isGameStarted) {
            // PIPES MOVEMENT
            pipes[i].topPipe.x -= pipeMoveSpeed;
            pipes[i].bottomPipe.x -= pipeMoveSpeed;

            // ADDING A NEW PIPE
            if (pipes[i].bottomPipe.x === 250 && pipes[i].topPipe.x === 250) {
                randomPipePosition = randomPipeFnc();
                pipes.push({ topPipe: { x: canvas.width, y: pipePositions[randomPipePosition].topY }, bottomPipe: { x: canvas.width, y: pipePositions[randomPipePosition].bottomY } });
            };

            // REMOVING THE PIPES THAT ARE OUT OF VIEW
            if (pipes[i].topPipe.x < -350) {
                pipes.splice(i, 1);
            };
        };
    };
};

// DRAW BIRD

function drawBird() {
    let birdImage = () => {
        if (birdImageState === 0) {
            return birdUpFlapImage;
        } else if (birdImageState === 1) {
            return birdMidFlapImage;
        } else if (birdImageState === 2) {
            return birdDownFlapImage;
        };
    };
    ctx.beginPath();
    ctx.drawImage(birdImage(), birdX, birdY, birdWidth, birdHeight);
    ctx.closePath();
};

setInterval(() => {
    birdImageState++

    if (birdImageState === 3) {
        birdImageState = 0;
    };
}, 100);

// CLEAR CANVAS

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// DRAW BACKGROUND

function drawBackground() {
    ctx.beginPath();
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.closePath();
};

// DRAW BASE

function drawBase() {
    // VISIBLE
    ctx.beginPath();
    ctx.drawImage(baseImage, visibleBaseX, visibleBaseY, baseWidth, baseHeight);
    ctx.closePath();

    // INVISIBLE
    ctx.beginPath();
    ctx.drawImage(baseImage, invisibleBaseX, invisibleBaseY, baseWidth, baseHeight);
    ctx.beginPath();

    // ANIMATION
    visibleBaseX -= baseMoveSpeed;
    invisibleBaseX -= baseMoveSpeed;

    if (visibleBaseX === -canvas.width) {
        visibleBaseX = 0;
    };

    if (invisibleBaseX === 0) {
        invisibleBaseX = canvas.width;
    };
};

// DRAW GAME OVER MENU

function drawGameOverMenu() {
    // GAME OVER IMAGE
    ctx.beginPath();
    ctx.drawImage(gameOverImage, gameOverMenuX, gameOverMenuY, gameOverMenuWidth, gameOverMenuHeight);
    ctx.closePath();

    // GAME OVER TEXT
    ctx.beginPath();
    ctx.font = '550 1.3rem "WDXL Lubrifont JP N", sans-serif';
    ctx.fillStyle = 'rgb(83 55 70)';
    ctx.fillText('CLICK ANYWHERE TO RESTART THE GAME!', gameOverMenuX + 50, gameOverMenuY + 120);
    ctx.closePath();
};

// DRAW

function draw() {
    clearCanvas();
    drawBackground();
    drawPipes();
    drawBase();
    drawBird();
    detectCollision();


    if (isGameOver) {
        drawGameOverMenu();
    };

    // BIRD ANIMATION
    if (isGameStarted || isJumpable) {
        birdVelocity += gravity;
        birdY += birdVelocity;
    };

    requestAnimationFrame(draw);
};

draw();

// BIRD JUMP

function birdJump() {
    birdVelocity = jump;
};

// HANDLE SOUND

function handleSound(src) {
    const audio = document.createElement('audio');
    audio.src = `./assets/audio/${src}`;
    audio.play();
};

// HANDLE KEYS
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('click', () => {
    // STARTING THE GAME
    if (!isGameStarted && !isJumpable) {
        startTheGame();
    };
    // JUMPING
    if (isGameOver === false) {
        birdJump();
    };
});

function handleKeyDown(e) {
    if (e.code === 'Space' && isGameOver === false) {
        birdJump();
    };
    // STARTING THE GAME
    if (!isGameStarted && !isJumpable) {
        startTheGame();
    };
};

// START THE GAME

function startTheGame() {
    isGameStarted = true;
    isJumpable = true;
};