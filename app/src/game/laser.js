'use strict';

import __nothing__        from 'core/calculus';
import Bacon              from 'Bacon';
import {Position2 as P2}  from 'core/vector';

function Laser(pos, rot, dir){
  this.duration  = 4;   // s
  this.moveSpeed = 500; // px/s

  var heading  = Bacon.constant(dir);
  var velocity = heading
    .times(this.moveSpeed);
  var end      = Bacon.later(this.duration * 1000);

  this.status  = Bacon.combineTemplate({
      position: velocity
        .integrate(pos)
        .skipDuplicates(P2.equals),
      rotation: rot,
      heading:  dir
    })
    .takeUntil(end);
}

export default Laser;
