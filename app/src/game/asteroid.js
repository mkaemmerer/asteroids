'use strict';

import Bacon                            from 'Bacon';
import __nothing__                      from 'engine/core/calculus';
import {Position2 as P2, Vector2 as V2} from 'engine/core/vector';
import {toWorldCoordinates}             from 'game/world';

function Asteroid(pos, size){
  this.collisions = new Bacon.Bus();
  this.radius     = 10*size;
  this.size       = size;

  var rotation  = Math.random() * 2 * Math.PI;
  var velocity  = Bacon.constant(V2.fromRotation(rotation)).times(20);

  var destroyed = this.collisions.take(1);

  this.status  = Bacon.combineTemplate({
      position: velocity
        .integrate(pos)
        .map(toWorldCoordinates),
      rotation: rotation
    })
    .takeUntil(destroyed);

  this.fragments = destroyed
    .map(this.status)
    .flatMap(this.explode.bind(this))
    .delay(0);
}
Asteroid.prototype.explode = function(status){
  if(this.size > 1){
    return Bacon.fromArray([
      new Asteroid(status.position, this.size-1),
      new Asteroid(status.position, this.size-1)
    ]);
  } else {
    return Bacon.never();
  }
};

export default Asteroid;
