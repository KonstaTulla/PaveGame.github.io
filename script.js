const startButton = document.getElementById('startButton');
const player = document.getElementById('player');
const gameArea = document.getElementById('game');

// Odota, että DOM on ladattu
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        startGame();
    });
});

// Pelin käynnistysfunktio
function startGame() {
    // Täällä voit laittaa koodin, joka käynnistää pelin
    console.log("Peli käynnistetty!");
    // Esimerkiksi voit aloittaa pelin logiikan, nollata pelaajan sijainnin jne.
}

let isJumping = false;
let gameRunning = false;
let jumpHeight = 0;
const maxJumpHeight = 170; // Maksimi hyppykorkeus
const gravity = 7; // Painovoima, joka vetää pelaajan alas
let jumpSpeed = 15; // Nopeus, jolla pelaaja hyppää
let obstacleSpeed = 3.7; // Esteiden liikenopeus
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

function startObstacleCreation() {
    const minInterval = 2000; // Minimum interval for obstacle creation (ms)
    const maxInterval = 7000; // Maximum interval for obstacle creation (ms)

    function createObstacleWithRandomInterval() {
        createObstacles(); // Luo este
        const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval; // Satunnainen väli
        setTimeout(createObstacleWithRandomInterval, randomInterval); // Luo uusi este satunnaisessa ajassa
    }

    function createObstacles() {
        const gameWidth = 400; // Pelialueen leveys
        const obstacleWidth = 30; // Esteen leveys
        const obstacleHeight = 30; // Esteen korkeus

        const obstacle = document.createElement('div'); // Luodaan div esteelle
        const obstacle2 = Math.random() < 0.5; // Arvotaan esteen tyyppi
        obstacle.className = obstacle2 ? 'obstacle2' : 'obstacle'; // Asetetaan esteen tyyppi

        obstacle.style.position = 'absolute';
        obstacle.style.left = `${gameWidth}px`; // Asetetaan este oikeaan reunaan
        obstacle.style.width = `${obstacleWidth}px`; // Asetetaan esteen

        obstacle.style.height = `${obstacleHeight}px`; // Asetetaan esteen korkeus

        // Asetetaan esteen väri ja sijainti
        
        if (obstacle2) {
            obstacle.style.bottom = '0px'; // Asetetaan obstacle2 maantasoon
        } else {
            obstacle.style.bottom = '30px'; // Asetetaan obstacle 30 pikseliä korkealle
        }

        gameArea.appendChild(obstacle);
        obstacles.push(obstacle); // Lisätään este listaan
    }

    function moveObstacles() {
        obstacles.forEach((obstacle, index) => {
            obstacle.style.left = (parseInt(obstacle.style.left) - obstacleSpeed) + 'px'; // Liikutetaan esteitä vasemmalle

            // Tarkistetaan, onko este poistunut näkyvistä
            if (parseInt(obstacle.style.left) < -30) { // Rajan tarkistus
                obstacle.remove(); // Poistetaan este
                obstacles.splice(index, 1); // Poistetaan este listasta
            }

            // Tarkistetaan törmäys pelaajan kanssa
            if (isCollision(player, obstacle)) {
                endGame(); // Lopeta peli törmäyksen sattuessa
            }
        });

        if (gameRunning) {
            requestAnimationFrame(moveObstacles); // Päivitetään esteiden sijainti seuraavassa ruudunpäivityksessä
        }
    }

    function isCollision(player, obstacle) {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
    
        // Määritä hitboxin offsetit
        const leftOffset = 18;   // Vasen offset
        const rightOffset = 18;  // Oikea offset
        const topOffset = 0;     // Ylä offset
        const bottomOffset = 5;  // Ala offset (pienempi arvo)
    
        return (
            playerRect.left + leftOffset < obstacleRect.right &&
            playerRect.right - rightOffset > obstacleRect.left &&
            playerRect.top + topOffset < obstacleRect.bottom &&
            playerRect.bottom - bottomOffset > obstacleRect.top
        );
    }

    function endGame() {
        gameRunning = false;
        alert('Äänestä Paavoa, Make Tietotie Rave Again!'); // Ilmoitus pelin päättymisestä
        obstacles.forEach((obstacle) => obstacle.remove()); // Poista kaikki esteet
        obstacles = []; // Tyhjennä esteiden lista
        startButton.style.display = 'block'; // Näytä "Aloita peli" -painike uudelleen
    }

    createObstacleWithRandomInterval(); // Aloita esteiden luonti
    moveObstacles(); // Aloita esteiden liikkuminen
}

// Aloita esteiden luonti ja liikkuminen heti pelin alussa
startObstacleCreation();