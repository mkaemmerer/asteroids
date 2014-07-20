'use strict';

import {Position2 as P2}  from 'core/vector';

var width  = 400;
var height = 300;

function wrap(x, lo, hi){
  while(x<lo){
    x += (hi - lo);
  }
  while(x>hi){
    x -= (hi - lo);
  }
  return x;
}

function toWorldCoordinates(p){
  return P2(
      wrap(p.x, 0, width),
      wrap(p.y, 0, height)
    );
}

export {width, height, toWorldCoordinates};
