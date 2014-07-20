'use strict';

import __nothing__                      from 'core/calculus';
import Bacon                            from 'Bacon';
import {Position2 as P2, Vector2 as V2} from 'core/vector';
import Laser                            from 'game/laser';

function Ship(pos, controls){
  this.moveSpeed = 100;                 // px/s
  this.turnSpeed = 0.75 * (2*Math.PI);  // radians/s

  var rotation = controls.direction
    .map('.dx')
    .times(this.turnSpeed)
    .integrate(0)
    .skipDuplicates();
  var heading  = Bacon.constant(V2(0,1))
    .combine(rotation, V2.rotate);
  var velocity = controls.direction
    .map('.dy')
    .times(this.moveSpeed)
    .times(heading);

  this.fire    = controls.action;
  this.status  = Bacon.combineTemplate({
    position: velocity
      .integrate(pos)
      .skipDuplicates(P2.equals),
    rotation: rotation,
    heading:  heading
  });
  this.lasers  = this.status
    .sampledBy(this.fire)
    .map(this.shootLaser.bind(this));
}
Ship.prototype.shootLaser = function(status){
  return new Laser(status.position, status.rotation, status.heading);
};

export default Ship;
