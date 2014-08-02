'use strict';

import Bacon                    from 'Bacon';
import __nothing__              from 'core/util';
import Game                     from 'game';
import HUD                      from 'hud';

import Stage                    from 'graphics/stage';
import {Graphics, HUDGraphics}  from 'graphics';

function runGame(){
  return new Game();
}
var game     = Bacon.once(runGame())
  .delay(0)
  .waterfall(function(game){
    return game.end
      .delay(4000) //Start a new game 4 seconds after the last one ends
      .map(runGame);
  });
var hud      = game.map(function(g){ return new HUD(g) });


var stage        = new Stage({width: 400, height: 300, container: 'game'});
var graphics     = new Graphics(stage, game);
var hud_graphics = new HUDGraphics(stage, hud);
