'use strict';

import Bacon from 'Bacon';
import {Position2 as P2} from 'core/vector';

function HUD(game){
  this.start   = Bacon.once();

  this.waveEnd = game.waves
    .flatMap('.end')
    .delay(1000)
    .map(function(){
      return new Message('WAVE COMPLETE', 2000);
    });

  this.gameEnd = game.end
    .delay(1000)
    .map(function(){
      return new Message('GAME OVER', 2000);
    });
}

function Message(message, duration){
  var w = 400;
  var h = 300;

  this.start  = Bacon.once();

  this.status = Bacon.combineTemplate({
    position: P2(w/2, h/2),
    rotation: 0,
    text:     message
  })
  .sampledBy(Bacon.once().concat(Bacon.later(duration)))
  .toProperty();
}

export default HUD;
