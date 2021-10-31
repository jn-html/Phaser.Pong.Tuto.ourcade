import Phaser from 'phaser'

import WebFontFile from './WebFontFile';

import { GameBackground } from '../consts/SceneKeys';

import * as Colors from '../consts/Colors'

export default class Game extends Phaser.Scene {

  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)

    this.leftScore = 0
    this.rightScore = 0
  }

  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P')
    this.load.addFile(fonts)
  }

  create() {

    this.scene.run(GameBackground)
    this.scene.sendToBack(GameBackground)

    this.physics.world.setBounds(-100, 0, 1000, 500)

    this.ball = this.add.circle(400, 250, 10, Colors.White, 1)
    this.physics.add.existing(this.ball)
    // ball is a box instead of circle, so setCircle (radius 10)
    this.ball.body.setCircle(10)
    this.ball.body.setBounce(1,1)

    this.ball.body.setCollideWorldBounds(true, 1, 1)

    // this.resetBall()

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, Colors.White, 1)
    this.physics.add.existing(this.paddleLeft, true)
    
    this.paddleRight = this.add.rectangle(750, 250, 30, 100, Colors.White, 1)
    this.physics.add.existing(this.paddleRight, true)
    
    /**@type {Phaser.Physics.Arcade.Body} */

    this.physics.add.collider(this.paddleLeft ,this.ball)
    this.physics.add.collider(this.paddleRight ,this.ball)

    const scoreStyle = {
      fontSize: 38,
      fontFamily: '"Press Start 2P"'
    }

    this.leftScoreLabel = this.add.text(300, 125, '0', scoreStyle).setOrigin(0.5, 0.5)
    this.rightScoreLabel = this.add.text(500, 375, '0', scoreStyle).setOrigin(0.5, 0.5)
    
    this.cursors = this.input.keyboard.createCursorKeys()
    
    this.time.delayedCall(1000, () => {
      this.resetBall()
    })
    
  }

  update() {
    
    this.processPlayerInput()
    this.updateAI()
    this.checkScore()
    
  }

  
  processPlayerInput() {
    /**@type {Phaser.Physics.Arcade.Body} */
    const body = this.paddleLeft.body

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10
      body.updateFromGameObject()
    }
    else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10
      body.updateFromGameObject()
    }
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y
    if (Math.abs(diff) < 10) {
      return
    }

    const aiSpeed = 3
    if (diff < 0) {
      // ball above paddle
      this.paddleRightVelocity.y = -aiSpeed
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10
      }
    } 
    else if (diff > 0) {
      // ball below paddle
      this.paddleRightVelocity.y = aiSpeed
      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10
      }
    }

    this.paddleRight.y += this.paddleRightVelocity.y
    this.paddleRight.body.updateFromGameObject()
  }

  checkScore() {
    if (this.ball.x < -30) {
      // scored on left side
      this.resetBall()
      this.incrementLeftScore()
    }
    else if (this.ball.x > 830) {
      // scored on the right side
      this.resetBall()
      this.incrementRightScore()
    }
    
  }

  incrementLeftScore() {
    this.leftScore += 1
    this.leftScoreLabel.text = this.leftScore
  }

  incrementRightScore() {
    this.rightScore += 1
    this.rightScoreLabel.text = this.rightScore
  }

  resetBall() {

    this.ball.setPosition(400, 250)
    
    const angle = Phaser.Math.Between(0, 360)
    const vec = this.physics.velocityFromAngle(angle, 200)

    this.ball.body.setVelocity(vec.x, vec.y)
  }

}
