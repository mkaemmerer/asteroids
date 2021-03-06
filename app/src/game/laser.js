'use strict';

import Bacon                            from 'Bacon';
import __nothing__                      from 'engine/core/calculus';
import {Position2 as P2, Vector2 as V2} from 'engine/core/vector';
import {toWorldCoordinates}             from 'game/world';

function Laser(pos, rot){
  this.collisions = new Bacon.Bus();
  this.radius     = 3;
  this.duration   = 0.6; // s
  this.moveSpeed  = 500; // px/s

  var heading     = Bacon.constant(V2.fromRotation(rot));
  var velocity    = heading.times(this.moveSpeed);
  var end         = Bacon.later(this.duration * 1000);
  var hit         = this.collisions.take(1);

  this.status  = Bacon.combineTemplate({
      position: velocity
        .integrate(pos)
        .map(toWorldCoordinates),
      rotation: rot,
      heading:  heading
    })
    .takeUntil(end)
    .takeUntil(hit);
}

export default Laser;
