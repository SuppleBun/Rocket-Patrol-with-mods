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