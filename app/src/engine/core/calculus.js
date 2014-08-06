'use strict';

import {scale, add} from 'engine/core/math';
import Bacon        from 'Bacon';


var dt = 1000/60;

function property(value){
  if(value instanceof Bacon.Observable){
    return value;
  }
  return Bacon.constant(value);
}

Bacon.Observable.prototype.integrate = function(start){
  return this.toProperty()
    .sample(dt)
    .map(scale, dt/1000)
    .scan(start, add);
};
Bacon.Observable.prototype.times = function(factor){
  return this.combine(property(factor), scale);
};
Bacon.Observable.prototype.plus  = function(amount){
  return this.combine(property(amount), add);
};

Bacon.Math = {};
Bacon.Math.sum = function(values, initial){
  return values.reduce(function(v, memo){
    return memo.combine(v, add);
  }, new Bacon.constant(initial));
};

export default {};
