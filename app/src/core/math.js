'use strict';

import {Scalar as S, Position2 as P2, Vector2 as V2} from 'core/vector';

function scale(x,y){
  if(x instanceof V2 && y instanceof S){
    return scaleVector(y,x);
  }
  if(y instanceof V2 && x instanceof S){
    return scaleVector(x,y);
  }
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
  if(x instanceof S && y instanceof S){
    return addScalars(x,y);
  }

  return addNumbers(x,y);
}
function addNumbers(x,y){
  return x+y;
}
function addScalars(s1,s2){
  return s1.plus(s2);
}
function addVectors(v1,v2){
  return v1.plus(v2);
}
function addPointVector(p,v){
  return p.offset(v);
}

//A polymorphic difference function
function diff(x,y){
  if(x instanceof P2 && y instanceof P2){
    return diffPoints(x,y);
  }
  if(x instanceof V2 && y instanceof V2){
    return diffVectors(x,y);
  }

  return diffNumbers(x,y);
}
function diffNumbers(x,y){
  return x-y;
}
function diffVectors(v1,v2){
  return v1.plus(v2.times(-1));
}
function diffPoints(p1,p2){
  return V2.fromTo(p2,p1);
}

export {add, diff, scale};
