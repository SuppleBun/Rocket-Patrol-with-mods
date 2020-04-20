/*
    name: Joonsu Jun
    Implemented:
    1. high score tracker (10 pts)
    2. cool background music in play scene (10 pts)
    3. allows the rocket to be controlled after it's fired (10 pts)
    4. better/prettier scrolling tile sprite for background (10 pts)
    5. new spaceship type that moves faster and is worth more points (25 pts)
    6. alternating 2 player mode (25 pts)
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;

// set high score variable
let highScore = 0;

// set player1 boolean
let player1Play = true;

// score
p1Score = 0;
p2Score = 0;