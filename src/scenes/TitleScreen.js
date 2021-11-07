import Phaser from 'phaser';

import WebFontFile from './WebFontFile';
import { PressStart2P } from '../consts/Fonts';

import { Game } from '../consts/SceneKeys'
import * as AudioKeys from '../consts/AudioKeys'


export default class TitleScreen extends Phaser.Scene {

  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P')
    this.load.addFile(fonts)
  }

  create() {
    const title = this.add.text(400, 250, 'Old School \n\n Air Hockey\n\n\n', {
      fontSize: 38,
      fontFamily: PressStart2P
    })
    title.setOrigin(0.5, 0.5);

    this.add.text(400, 250, 'Press Space to Start', {
      fontFamily: PressStart2P
    }).setOrigin(0.5, -3.5);

    this.input.keyboard.on('keydown-SPACE', () => {
      this.sound.play(AudioKeys.PongBip)
      this.scene.start(Game)
    })


  }

}
