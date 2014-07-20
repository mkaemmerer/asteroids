'use strict';

import __nothing__                      from 'core/calculus';
import Bacon                            from 'Bacon';
import {Position2 as P2, Vector2 as V2} from 'core/vector';

function Ship(pos, controls){
  this.moveSpeed = 100;                 // px/s
  this.turnSpeed = 0.75 * (2*Math.PI);  // radians/s

  var rotation = controls.movement
    .map('.dx')
    .times(this.turnSpeed)
    .integrate(0)
    .skipDuplicates();
  var heading  = Bacon.constant(V2(0,1))
    .combine(rotation, V2.rotate);
  var velocity = controls.movement
    .map('.dy')
    .times(this.moveSpeed)
    .times(heading);

  this.status = Bacon.combineTemplate({
    position: velocity
      .integrate(pos)
      .skipDuplicates(P2.equals),
    rotation: rotation,
    heading:  heading
  });
}

//Exports:
export default Ship;
