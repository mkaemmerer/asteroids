'use strict';

import {Position2 as P2} from 'core/vector';
import {Controls}        from 'game/controls';
import Ship              from 'game/ship';

function Game(){
  this.start  = Bacon.once().toProperty();
  this.ship   = this.start.map(createShip);
  this.lasers = this.ship.flatMap('.lasers');
}

function createShip(){
  var controls = Controls.KeyboardControls();
  var ship     = new Ship(P2(0,0), controls);
  return ship;
}

export default Game;
