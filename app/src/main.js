'use strict';

import Bacon       from 'Bacon';
import __nothing__ from 'core/util';
import Game        from 'game';
import Graphics    from 'graphics';

function runGame(){
  return new Game();
}

var game     = Bacon.once(runGame())
  .delay(0)
  .waterfall(function(game){
    return game.end
      .delay(2000) //Start a new game 2 seconds after the last one ends
      .map(runGame);
  });

var graphics = new Graphics(game);
