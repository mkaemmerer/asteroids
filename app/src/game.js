'use strict';

import Bacon             from 'Bacon';
import __nothing__       from 'core/util';
import {Position2 as P2} from 'core/vector';
import {Controls}        from 'game/controls';
import Collisions        from 'game/collisions';
import Ship              from 'game/ship';
import Asteroid          from 'game/asteroid';


function Game(){
  var game = this;

  this.collisions = new Collisions({
    'ship':       ['asteroids'],
    'lasers':     ['asteroids'],
    'asteroids':  ['ship', 'lasers']
  });

  this.start     = Bacon.once();

  this.waves     = Bacon.once()
    .delay(0)
    .map(game.startWave)
    .waterfall(function(w){
      return w.end
        .delay(2000) //Start a new wave 2 seconds after the previous one ends
        .map(game.startWave);
    });
  this.ship      = Bacon.once()
    .toProperty()
    .flatMap(this.spawnShip)
    .doAction(this.registerCollisions.bind(this), 'ship')
    .toProperty();
  this.asteroids = this.waves
    .flatMap('.asteroids')
    .doAction(this.registerCollisions.bind(this), 'asteroids')
    .toProperty();
  this.lasers    = this.ship
    .flatMap('.lasers')
    .doAction(this.registerCollisions.bind(this), 'lasers')
    .toProperty();

  this.end = this.ship
    .flatMap('.status')
    .end();
}
Game.prototype.registerCollisions = function(layer, object){
  var collisions = this.collisions;
  var messages   = collisions.register(object, layer);
  object.collisions.plug(messages);
  object.status.onEnd(function(){
    collisions.unregister(object, layer);
  });
};
Game.prototype.spawnShip = function(){
  var w = 400;
  var h = 300;
  var controls   = Controls.KeyboardControls();
  var ship       = new Ship(P2(w/2,h/2), controls);

  return Bacon.once(ship);
};
Game.prototype.startWave = function(){
  return new Wave();
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
