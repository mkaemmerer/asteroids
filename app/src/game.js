'use strict';

import Bacon             from 'Bacon';
import __nothing__       from 'core/util';
import {Position2 as P2} from 'core/vector';
import {Controls}        from 'game/controls';
import Collisions        from 'game/collisions';
import Ship              from 'game/ship';
import Asteroid          from 'game/asteroid';


function Game(){
  this.collisions = new Collisions({
    'ship':       ['asteroids'],
    'lasers':     ['asteroids'],
    'asteroids':  ['ship', 'lasers']
  });

  this.start     = Bacon.once();

  this.waves     = Bacon.once()
    .map(this.startWave)
    .delay(0)
    .waterfall(function(w){
      return w.end
        .delay(4000) //Start a new wave 4 seconds after the previous one ends
        .map(this.startWave);
    }.bind(this));

  var shipInfo = Bacon.tie({
    ships:      this._ships.bind(this),
    extraLives: this._extraLives.bind(this)
  });
  this.extraLives = shipInfo.extraLives;
  this.ships      = shipInfo.ships
    .doAction(this.registerCollisions.bind(this), 'ship')
    .toProperty();

  this.asteroids = this.waves
    .flatMap('.asteroids')
    .doAction(this.registerCollisions.bind(this), 'asteroids')
    .toProperty();
  this.lasers    = this.ships
    .flatMap('.lasers')
    .doAction(this.registerCollisions.bind(this), 'lasers')
    .toProperty();

  this.end = this.extraLives
    .where().lessThan(0)
    .take(1);
}
Game.prototype.registerCollisions = function(layer, object){
  var collisions = this.collisions;
  var messages   = collisions.register(object, layer);
  object.collisions.plug(messages);
  object.status.onEnd(function(){
    collisions.unregister(object, layer);
  });
};

Game.prototype.startWave = function(){
  return new Wave();
};
Game.prototype.spawnShip = function(){
  var w = 400;
  var h = 300;
  var controls   = Controls.KeyboardControls();
  var ship       = new Ship(P2(w/2,h/2), controls);

  return ship;
};
Game.prototype._ships       = function(info){
  var hasExtraLives = info.extraLives
    .toProperty()
    .is().greaterThanOrEqualTo(0);

  return Bacon.once()
    .map(this.spawnShip)
    .delay(0)
    .waterfall(function(s){
      return s.status.end()
        .delay(2000)
        .map(this.spawnShip);
    }.bind(this))
    .takeWhile(hasExtraLives);
};
Game.prototype._extraLives = function(info){
  var shipDestroyed = info.ships
    .flatMap('.status.end');

  return Bacon.update(2,
    [shipDestroyed], function(x){ return x-1; });
};


function Wave(){
  this.start = Bacon.once();

  this.asteroids = this.start
    .flatMap(this.spawnAsteroids)
    .delay(0)
    .waterfall('.fragments');

  this.end       = this.asteroids.end();
}
Wave.prototype.spawnAsteroids = function(){
  var w = 400;
  var h = 300;

  var spawns    = [P2(50,50), P2(w-50,50), P2(50,h-50), P2(w-50,h-50)];
  var asteroids = Bacon.fromArray(spawns)
    .map(function(pos){
      return new Asteroid(pos, 3);
    });

  return asteroids;
};

export default Game;
