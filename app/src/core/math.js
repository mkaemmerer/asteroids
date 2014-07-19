'use strict';

import {Scalar as S, Position2 as P2, Vector2 as V2} from 'vector';

function scale(x,y){
  if(x instanceof V2){
    return scaleVector(S(y),x);
  }
  if(y instanceof V2){
    return scaleVector(S(x),y);
  }

  return scaleNumber(x,y);
}
function scaleNumber(s,x){
  return x*s;
}
function scaleVector(s,v){
  return v.times(s);
}

//A polymorphic add function
function add(x,y){
  if(x instanceof P2 && y instanceof V2){
    return addPointVector(x,y);
  }
  if(x instanceof V2 && y instanceof V2){
    return addVectors(x,y);
  }

  return addNumbers(x,y);
}
function addNumbers(x,y){
  return x+y;
}
function addVectors(v1,v2){
  return v1.plus(v2);
}
function addPointVector(p,v){
  return p.offset(v);
}

export {scale, add};
