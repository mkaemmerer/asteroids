'use strict';

import __nothing__                      from 'core/calculus';
import Bacon                            from 'Bacon';
import {Position2 as P2, Vector2 as V2} from 'core/vector';
import {toWorldCoordinates}             from 'game/world';
import Laser                            from 'game/laser';

function Ship(pos, controls){
  this.collisions = new Bacon.Bus();
  this.radius     = 10;                  // px
  this.moveSpeed  = 100;                 // px/s/s
  this.turnSpeed  = 0.75 * (2*Math.PI);  // radians/s

  var rotation = controls.direction
    .map('.dx')
    .times(this.turnSpeed)
    .integrate(0)
    .skipDuplicates();
  var heading      = rotation.map(V2.fromRotation);
  var acceleration = controls.direction
    .map('.dy')
    .times(this.moveSpeed)
    .times(heading);
  var hit          = this.collisions.take(1);

  this.status  = Bacon.combineTemplate({
      position: acceleration
        .integrate(V2.zero)
        .integrate(pos)
        .map(toWorldCoordinates),
      rotation: rotation
    })
    .takeUntil(hit);
  this.fire    = controls.action
    .map(this.status)
    .takeUntil(hit);
  this.lasers  = this.fire
    .map(this.shoot.bind(this));
}
Ship.prototype.shoot = function(status){
  var laser = new Laser(status.position, status.rotation);
  return laser;
};

export default Ship;
