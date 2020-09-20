import Phaser from 'phaser'
import { ANIM, TEXTURE } from '../constants/KEY'
import { PLAYER } from '../constants/ELEMENT'
import PlayGameScene from '~/scenes/PlayGameScene'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private _scene?: PlayGameScene

    constructor(scene: PlayGameScene) {
        super(scene, PLAYER.START_X, PLAYER.START_Y, TEXTURE.PLAYER)
        this._scene = scene

        scene.add.existing(this)

        // physic
        scene.physics.world.enable(this)
        this.setBounce(PLAYER.BOUNCE)
        this.setCollideWorldBounds(true)
        this.setGravity(PLAYER.GRAVITY_X, PLAYER.GRAVITY_Y)
        // animations
        this.createAnimations(TEXTURE.PLAYER)
    }

    createAnimations(playerTexture: string) {
        this._scene?.anims.create({
            key: ANIM.PLAYER_TO_LEFT,
            frames: this._scene?.anims.generateFrameNames(playerTexture, {
                prefix: 'robo_player_',
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1 // loop infinitely
        })
   
        this._scene?.anims.create({
            key: ANIM.PLAYER_TO_RIGHT,
            frames: this._scene?.anims.generateFrameNames(playerTexture, {
                prefix: 'robo_player_',
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        })

        this._scene?.anims.create({
            key: ANIM.PLAYER_JUMP,
            frames: [{
                key: playerTexture,
                frame: 'robo_player_1'
            }],
            frameRate: 10
        })

        this._scene?.anims.create({
            key: ANIM.PLAYER_IDLE,
            frames: [{
                key: playerTexture,
                frame: 'robo_player_0'
            }],
            frameRate: 10
        })
    }

    reset(){
        this.setVelocity(0, 0);
        this.setX(50);
        this.setY(300);
        this.play(ANIM.PLAYER_IDLE, true);
        this.setAlpha(0);
        // animation
        const teenw = this._scene?.tweens.add({
            targets: this,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
        });
    }
}