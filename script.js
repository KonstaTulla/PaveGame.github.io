const startButton = document.getElementById('startButton');
const player = document.getElementById('player');
const gameArea = document.getElementById('game');

const title = document.getElementById('title2');
let scale = 1;
let growing = true;

let score = 0;
let scoreInterval; // Muuttuja, johon tallennetaan setIntervalin palauttama ID
let isGameRunning = false; // Muuttuja pelin tilan seuraamiseen


// Funktio, joka lisää pisteitä
function addScore(points) {
    score += points;
    document.getElementById('score').innerText = score;
}

// Funktio, joka aloittaa pisteiden lisäämisen
function startScoring() {
    scoreInterval = setInterval(function() {
        addScore(1); // Lisää 1 piste joka sadas millisekunti
    }, 100); // 
    console.log('Score Start')
}

// Funktio, joka lopettaa pisteiden lisäämisen
function stopScoring() {
    clearInterval(scoreInterval);
    console.log('Score Stop'); // Lopeta pisteiden laskeminen
}

function resetScore() {
    score = 0; // Nollaa pisteet
    document.getElementById('score').innerText = score; // Päivitä näyttö
    console.log('Score Reset'); // Tulosta konsoliin
}

// Esimerkki kutsuista
startScoring(); // Aloita pisteiden lisääminen

function animateText() {
    if (growing) {
        scale += 0.01; // Kasvata skaalausta
        if (scale >= 1.35) { // Kun skaalaus on 1.5, vaihda suuntaa
            growing = false;
        }
    } else {
        scale -= 0.01; // Vähennä skaalausta
        if (scale <= 1) { // Kun skaalaus on 1, vaihda suuntaa
            growing = true;
        }
    }
    title.style.transform = `rotate(-15deg) scale(${scale})`; // Aseta uusi skaalaus
    requestAnimationFrame(animateText); // Kutsu funktiota uudelleen
}

// Aloita animaatio
animateText();
// Aloita peli, kun painetaan "Aloita peli" -painiketta
let gameRunning = false;

startButton.addEventListener('click', startGame);
startButton.addEventListener('click', showGame);
startButton.addEventListener('click', showGame2); // Nollaa pisteet)


function showGame() {
    const gameElement = document.getElementById('game');
    gameElement.style.display = 'block'; // Muuta display-arvo 'block':ksi
}

function showGame2() {
    const gameElement = document.getElementById('gameContainer');
    gameElement.style.display = 'block'; // Muuta display-arvo 'block':ksi
}

function hidegame() {
    const gameElement = document.getElementById('game');
    gameElement.style.display = 'none'; // Muuta display-arvo 'block':ksi
}

function hideGame2() {
    const gameElement = document.getElementById('gameContainer');
    gameElement.style.display = 'none'; // Muuta display-arvo 'block':ksi
}

function showtitle3() {
    const gameElement = document.getElementById('title3');
    gameElement.style.display = 'block'; // Muuta display-arvo 'block':ksi
}

function showtitle4() {
    const gameElement = document.getElementById('title4');
    gameElement.style.display = 'block'; // Muuta display-arvo 'block':ksi
}


function startGame() {
    if (gameRunning) return; // Estä pelin käynnistäminen uudelleen
    gameRunning = true;
    scoreInterval = setInterval(function() {
        addScore(1); // Lisää 1 piste joka sadas millisekunti
    }, 100); // 100 millisekuntia = 0.1 sekuntia
    document.getElementById('score').innerText = score; // Päivitä näyttö
    startButton.style.display = 'none'; // Piilotetaan "Aloita peli" -painike
    resetPlayer(); // Palauta pelaaja alkuasentoon
    startObstacleCreation(); // Aloitetaan esteiden luonti
    startScoring(); // Aloita pisteiden laskeminen
    moveObstacles(); // Aloita esteiden liikkuminen
    console.log('Game Started Succefully');
}

function endGame() {
    gameRunning = false; // Estä pelin jatkaminen
    startButton.style.display = 'block'; // Näytä "Aloita peli" -painike
    resetObstacles(); // Poista kaikki esteet
    hidegame();
    hideGame2();
    showtitle3();
    showtitle4();
    stopScoring();
    console.log("Game Over, Start");
}

function resetObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.remove(); // Poista este pelialueelta
    });
    obstacles = []; // Tyhjennä esteiden lista
}

 // Esimerkiksi voit aloittaa pelin logiikan, nollata pelaajan sijainnin jne.
 

// Törmäystarkistuksen kutsuminen
function checkCollisions(player) {
    obstacles.forEach(obstacle => {
        if (obstacle.className === 'obstacle' && isCollisionWithObstacle1(obstacle, player)) {
            endGame();
            stopScoring(); // Lopeta peli törmäyksen sattuessa
        } else if (obstacle.className === 'obstacle2' && isCollisionWithObstacle2(obstacle, player)) {
            endGame();
            stopScoring(); // Lopeta peli törmäyksen sattuessa
        }
    });
}

let isJumping = false;
let jumpHeight = 0;
const maxJumpHeight = 170; // Maksimi hyppykorkeus
const gravity = 7; // Painovoima, joka vetää pelaajan alas
let jumpSpeed = 15; // Nopeus, jolla pelaaja hyppää
let obstacleSpeed = 3.73; // Esteiden liikenopeus
let obstacles = []; // Lista esteistä

// Käynnistä peli, kun painetaan "Aloita peli" -painiketta
startButton.addEventListener('click', startGame);
// Lisää klikkikuuntelija pelialueelle, joka aktivoi hyppäyksen
gameArea.addEventListener('click', function() {
    if (gameRunning) {
        jump(); // Suorita hyppy, jos peli on käynnissä
    }
});
// Kuuntele hyppyä (esim. välilyönti)
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') { // Tarkista, onko painettu välilyöntiä
        if (!gameRunning) {
            startGame(); // Käynnistä peli
        }
        jump(); // Suorita hyppy
    }
});

function startGame() {
    if (gameRunning) return; // Estä pelin käynnistäminen uudelleen
    gameRunning = true;
    console.log('Peli käynnistetty!');
    startButton.style.display = 'none'; // Piilotetaan "Aloita peli" -painike
    resetPlayer(); // Palauta pelaaja alkuasentoon
    startObstacleCreation(); // Aloitetaan esteiden luonti
}

function jump() {
    if (isJumping) return; // Estä hyppy, jos pelaaja on jo ilmassa
    isJumping = true;
    jumpHeight = 30; // Nollaa hyppykorkeus

    const jumpInterval = setInterval(() => {
        if (jumpHeight < maxJumpHeight) {
            jumpHeight += jumpSpeed; // Nosta pelaajaa
            player.style.bottom = `${jumpHeight}px`; // Aseta pelaajan sijainti
        } else {
            clearInterval(jumpInterval); // Lopeta ylös hyppääminen
            fall(); // Aloita putoaminen
        }
    }, 20); // Hyppy kesto
}

function fall() {
    const fallInterval = setInterval(() => {
        if (jumpHeight > 37) {
            jumpHeight -= gravity; // Vähennä hyppykorkeutta
            player.style.bottom = `${jumpHeight}px`; // Aseta pelaajan sijainti
        } else {
            clearInterval(fallInterval); // Lopeta putoaminen
            jumpHeight = 0; // Nollaa hyppykorkeus
            isJumping = false; // Hyppy on valmis
            resetPlayer(); // Palauta pelaaja maahan
        }
    }, 20); // Putoamisen kesto
}

function resetPlayer() {
    player.style.bottom = '27px'; // Palauta pelaaja maahan
}

function startObstacleCreation() { // Muuttuja aikavälin summalle

    function createObstacle1() {
        const gameWidth = 400; // Pelialueen leveys
        const obstacleWidth = 30; // Esteen leveys
        const obstacleHeight = 30; // Esteen korkeus
    
        // Luodaan div esteelle
        const obstacle = document.createElement('div'); 
        obstacle.className = 'obstacle'; // Asetetaan esteen tyyppi
        obstacle.style.position = 'absolute';
        obstacle.style.left = `${gameWidth}px`; // Asetetaan este oikeaan reunaan
        obstacle.style.width = `${obstacleWidth}px`; // Asetetaan esteen leveys
        obstacle.style.height = `${obstacleHeight}px`; // Asetetaan esteen korkeus
        obstacle.style.bottom = '30px'; // Asetetaan obstacle1 28 pikseliä korkealle
    
        // Lisätään este pelialueelle ja esteiden listaan
        gameArea.appendChild(obstacle);
        obstacles.push(obstacle); // Lisätään este listaan
    }
    
    function createObstacle2() {
        const gameWidth = 400; // Pelialueen leveys
        const obstacleWidth = 30; // Esteen leveys
        const obstacleHeight = 30; // Esteen korkeus
    
        // Luodaan div esteelle
        const obstacle = document.createElement('div'); 
        obstacle.className = 'obstacle2'; // Asetetaan esteen tyyppi
        obstacle.style.position = 'absolute';
        obstacle.style.left = `${gameWidth}px`; // Asetetaan este oikeaan reunaan
        obstacle.style.width = `${obstacleWidth}px`; // Asetetaan esteen leveys
        obstacle.style.height = `${obstacleHeight}px`; // Asetetaan esteen korkeus
        obstacle.style.bottom = '0px'; // Asetetaan obstacle2 maantasoon
    
        // Lisätään este pelialueelle ja esteiden listaan
        gameArea.appendChild(obstacle);
        obstacles.push(obstacle); // Lisätään este listaan
    }
    
    function isCollisionWithObstacle1(obstacle1, player) {
        const obstacleRect = obstacle1.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        // Määritä hitboxin offsetit
        const leftOffset = 18.5;   // Voit säätää näitä arvoja tarpeen mukaan
        const rightOffset = 18.5;  
        const topOffset = 7;     
        const bottomOffset = 0;  
        
        return (
            obstacleRect.left + leftOffset < playerRect.right &&
            obstacleRect.right - rightOffset > playerRect.left &&
            obstacleRect.top + topOffset < playerRect.bottom &&
            obstacleRect.bottom - bottomOffset > playerRect.top
        );
    }
    
    function isCollisionWithObstacle2(obstacle2, player) {
        const obstacle2Rect = obstacle2.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        // Määritä hitboxin offsetit
        const leftOffset = 19;   // Voit säätää näitä arvoja tarpeen mukaan
        const rightOffset = 19;  
        const topOffset = 0;     
        const bottomOffset = 0;  
        
        return (
            obstacle2Rect.left + leftOffset < playerRect.right &&
            obstacle2Rect.right - rightOffset > playerRect.left &&
            obstacle2Rect.top + topOffset < playerRect.bottom &&
            obstacle2Rect.bottom - bottomOffset > playerRect.top
        );
    }
    
    // Esimerkki esteiden luomisesta ja törmäystarkistuksesta
    function startObstacleCreation() {
        const minInterval = 1000; // Minimum interval for obstacle creation (ms)
        const maxInterval = 3500; // Maximum interval for obstacle creation (ms)
    
        function createObstacles() {
            const randomType = Math.random() < 0.5 ? createObstacle1 : createObstacle2; // Satunnainen esteen tyyppi
            randomType(); // Luo este
            const randomInterval = Math.max(2000, Math.floor(Math.random() * (maxInterval - minInterval) + minInterval)); // Varmista, että väli on vähintään 2000
            setTimeout(createObstacles, randomInterval); // Luo uusi este satunnaisessa ajassa
        }
    
        createObstacles(); // Aloita esteiden luominen
    }
    
    // Törmäystarkistuksen kutsuminen
    function checkCollisions(player) {
        obstacles.forEach(obstacle => {
            if (obstacle.className === 'obstacle' && isCollisionWithObstacle1(obstacle, player)) {
        endGame();
             // Lopeta peli törmäyksen sattuessa
    } else if (obstacle.className === 'obstacle2' && isCollisionWithObstacle2(obstacle, player)) {
        endGame();
             // Lopeta peli törmäyksen sattuessa
    }    if (isGameRunning) { // Tarkista, onko peli käynnissä
        isGameRunning = false; // Aseta peli ei-käynnissä olevaksi
        clearInterval(scoreInterval); // Lopeta pisteiden laskeminen
    }
});
}

// Muokkaa moveObstacles-funktiota niin, että se kutsuu checkCollisions-funktiota
function moveObstacles() {
obstacles.forEach((obstacle, index) => {
    obstacle.style.left = (parseInt(obstacle.style.left) - obstacleSpeed) + 'px'; // Liikutetaan esteitä vasemmalle

    // Tarkistetaan, onko este poistunut näkyvistä
    if (parseInt(obstacle.style.left) < -30) { // Rajan tarkistus
        obstacle.remove(); // Poistetaan este
        obstacles.splice(index, 1); // Poistetaan este listasta
    }
});

// Tarkista törmäykset pelaajan kanssa
checkCollisions(player);

if (gameRunning) {
    requestAnimationFrame(moveObstacles); // Päivitetään esteiden sijainti seuraavassa ruudunpäivityksessä
}
}

// Aloita esteiden luonti ja liikkuminen heti pelin alussa
startObstacleCreation();
moveObstacles(); // Aloita esteiden liikkuminen
}