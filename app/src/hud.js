'use strict';

import Bacon from 'Bacon';
import {Position2 as P2} from 'core/vector';

function HUD(game){
  this.start    = Bacon.once();

  var wave_end  = game.waves
    .flatMap('.end')
    .delay(1000)
    .map(function(){
      return new Message('WAVE COMPLETE', 2000);
    });
  var game_end  = game.end
    .delay(1000)
    .map(function(){
      return new Message('GAME OVER', 4000);
    });
  this.messages = Bacon.mergeAll(wave_end, game_end);

  this.score    = Bacon.once(new Score(game.score));
  this.lives    = Bacon.once(new Lives(game.extra_lives));
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
function Score(score){
  this.start = Bacon.once();

   this.status = Bacon.combineTemplate({
    position: P2(0, 10),
    rotation: 0,
    text:     score.map(function(pts){ return 'SCORE: ' + pts; })
  });
}
function Lives(lives){
  this.start = Bacon.once();

   this.status = Bacon.combineTemplate({
    position: P2(250, 10),
    rotation: 0,
    text:     lives.map(function(count){ return 'LIVES: ' + Math.max(count,0); })
  });
}

export default HUD;
