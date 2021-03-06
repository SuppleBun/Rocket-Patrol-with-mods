class Play extends Phaser.Scene {
    constructor (){
        super("playScene");
    }

    preload() {
        // load the sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('speedship', './assets/speedship.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile spritessss
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);   

        // add the rocket
        this.p1Rocket = new Rocket(this, game.config.width/2-8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        // add the speedship and spaceship
        this.ship01 = new Speedship(this, game.config.width+192, 132, 'speedship', 0, 50).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width+96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
    
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B131',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.scoreLeft1 = this.add.text(69, 54, "p1:"+p1Score,scoreConfig);
        this.scoreLeft2 = this.add.text(200, 54, "p2:"+p2Score,scoreConfig);

        // displays high score
        this.add.text(320, 54, "HIGH SCORE:"+highScore,scoreConfig);

        // game over flag
        this.gameOver = false;

        // cool background music
        // got help from this website: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/audio/
        var music = this.sound.add('music');
        music.setLoop(true);
        music.play();

        // play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if(p1Score > highScore) {
                highScore = p1Score;
                this.add.text(320, 54, "HIGH SCORE:"+highScore,scoreConfig);
            }
            
            if(p2Score > highScore){
                highScore = p2Score;
                this.add.text(320, 54, "HIGH SCORE:"+highScore,scoreConfig);
            }

            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to for next player turn', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + (64*2), '<- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;

            // determines who's turn is next
            if(player1Play) {
                player1Play = false;
            } else {
                player1Play = true;
            }
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
            p1Score = 0;
            p2Score = 0;
            player1Play = true;
        }

        // starfield background animation
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver) {
            this.p1Rocket.update(); // update rocket sprite
            this.ship01.update();   // update the three spaceships
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width &&
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height +rocket.y > ship.y) {
               return true;
           } else {
               return false;
           }
    }

    shipExplode(ship) {
        ship.alpha = 0; // temporarily hide ship
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0); // create explosion sprite  at ship's location
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () =>{     // callback after animation completes
            ship.reset();                       // resets ship's position
            ship.alpha = 1;                     // make the ship visible again
            boom.destroy();                     // remove explosion sprite
        })

        // score increment and repaint
        if(player1Play) {
            p1Score += ship.points;
            this.scoreLeft1.text = "p1:"+p1Score;
        } else {
            p2Score += ship.points;
            this.scoreLeft2.text = "p2:"+p2Score;
        }
        
        // explosion sfx
        this.sound.play('sfx_explosion');
    }
}