'use strict';

import Bacon                                         from 'Bacon';
import {Scalar as S, Vector2 as V2, Position2 as P2} from 'core/vector';
import {Controls}                                    from 'game/controls';
import Collisions                                    from 'game/collisions';
import Ship                                          from 'game/ship';
import Asteroid                                      from 'game/asteroid';

//Asteroids + their children + their children's children + ...
//TODO: is there a better name for this pattern?
Bacon.Observable.prototype.waterfall = function(f){
  var rest = this.map(f).flatMap(function(x){ return x.waterfall(f); });
  return rest.merge(this);
};

function Game(){
  this.collisions = new Collisions({
    'ship':       ['asteroids'],
    'lasers':     ['asteroids'],
    'asteroids':  ['ship', 'lasers']
  });

  this.start     = Bacon.once().toProperty();
  this.asteroids = this.start
    .flatMap(this.spawnAsteroids)
    .delay(0) //TODO: not sure why delay 0 is needed
    .waterfall('.fragments')
    .doAction(this.registerCollisions.bind(this), 'asteroids')
    .toProperty();
  this.ship      = this.start
    .flatMap(this.spawnShip)
    .doAction(this.registerCollisions.bind(this), 'ship')
    .toProperty();
  this.lasers    = this.ship
    .flatMap('.lasers')
    .doAction(this.registerCollisions.bind(this), 'lasers')
    .toProperty();
}
Game.prototype.registerCollisions = function(layer, object){
  var collisions = this.collisions;
  collisions.register(object, layer);
  object.status.onEnd(function(){
    collisions.unregister(object, layer);
  });
};


//Game setup
Game.prototype.spawnShip      = function(){
  var w = 400;
  var h = 300;
  var controls   = Controls.KeyboardControls();
  var ship       = new Ship(P2(w/2,h/2), controls);

  return Bacon.once(ship);
};
Game.prototype.spawnAsteroids = function(){
  var w = 400;
  var h = 300;

  var spawns    = [P2(50,50), P2(w-50,0), P2(50,h-50), P2(w-50,h-50)];
  var asteroids = Bacon.fromArray(spawns)
    .map(function(pos){
      return new Asteroid(pos, 3);
    });

  return asteroids;
};

export default Game;
