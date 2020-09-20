import { SCENE, TEXTURE, TILESET, TILEMAP, ANIM } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'
import Player from '~/elements/Player'
import Control from '~/Control'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false
    private _player?: Player

    constructor() {
        super(SCENE.LEVEL1)
    }

    preload() {
        this.load.image(TEXTURE.BACKGROUND, 'assets/images/background.png')
        this.load.image(TEXTURE.SPIKE, 'assets/images/spike.png')
        this.load.atlas(TEXTURE.PLAYER, 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json')

        // tileset
        this.load.image(TILESET.PLATFORM, 'assets/tilesets/platformPack_tilesheet.png')
        // tilemap
        this.load.tilemapTiledJSON(TILEMAP.LEVEL1, 'assets/tilemaps/level1.json')
    }

    create() {
        const background: Phaser.GameObjects.Image = this.add.image(0, 0, TEXTURE.BACKGROUND).setOrigin(0, 0)
        background.setScale(1, 0.6)

        const map = this.make.tilemap({ key: TILEMAP.LEVEL1 })
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('platformPack_tilesheet', TILESET.PLATFORM) // tileset name set in Tiled [level1.json]
        const platforms = map.createStaticLayer('platforms', tileset, -95, 200) // layer name set in Tiled [level1.json]
        platforms.setCollisionByExclusion([-1], true)

        this._player = new Player(this)

        // Create a sprite group for all spikes, set common properties to ensure that
        // sprites in the group don't move via gravity or by player collisions
        const spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Let's get the spike objects, these are NOT sprites
        const spikeObjects = map.getObjectLayer('spikes')['objects'] as Phaser.Types.Tilemaps.TiledObject[]

        // Now we create spikes in our sprite group for each object in our map
        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group, change the start y position to meet the platform 
            if (spikeObject.y && spikeObject.height && spikeObject.x) {
                const spike = spikes.create(spikeObject.x - 95, spikeObject.y + 202 - spikeObject.height, TEXTURE.SPIKE).setOrigin(0, -0) as Phaser.Physics.Arcade.Image
                // reduce collision size
                // to keep the bounding box correctly encompassing the spikes we add an offset that matches the height reduction
                spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20)
            }

        });

        Collision.setup(this)
        this.physics.add.collider(this._player, platforms)
        this.physics.add.collider(this._player, spikes, this.playerHitsSpike, undefined, this)
    }

    playerHitsSpike(thePlayer: Phaser.GameObjects.GameObject, theSpike: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        const spike = theSpike as Phaser.Physics.Arcade.Image

        player.reset()
    }

    update() {
        Control.setup(this, this._player)

        // game over
        if (this._gameOver) {
            return
        }
    }

    /* GETTERS - SETTERS */
    set gameOver(state: boolean) {
        this._gameOver = state
    }
}