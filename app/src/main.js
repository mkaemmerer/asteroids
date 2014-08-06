'use strict';

import Bacon                    from 'Bacon';
import __nothing__              from 'engine/core/util';
import Game                     from 'game';
import HUD                      from 'hud';

import Stage                    from 'engine/graphics/stage';
import AudioPlayer              from 'engine/audio';
import {Graphics, HUDGraphics}  from 'graphics';
import Audio                    from 'audio';

function runGame(){
  return new Game();
}
var game     = Bacon.once(runGame())
  .delay(0)
  .waterfall(function(game){
    return game.end
      .delay(5000) //Start a new game 5 seconds after the last one ends
      .map(runGame);
  });


//Graphics
var stage        = new Stage({width: 400, height: 300, container: 'game'});
var graphics     = new Graphics(stage, game);
var hud_graphics = new HUDGraphics(stage, game.map(function(g){ return new HUD(g) }));

//Audio
var audio_player = new AudioPlayer();
var audio        = new Audio(audio_player, game);
