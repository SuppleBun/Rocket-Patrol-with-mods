// Speedship prefab
class Speedship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); // adds to existing scene, displaylist, and updatelist
        this.points = pointValue; // stores pointValue
    }

    update() {
        // move spaceship to the left
        this.x -= game.settings.spaceshipSpeed+2;

        //wraparound the spaceship from left to right
        if(this.x <= 0-this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}