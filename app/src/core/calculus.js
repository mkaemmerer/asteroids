'use strict';

import {scale, add} from 'math';
import Bacon from 'Bacon';


var dt = 1000/60;

Bacon.Property.prototype.integrate = function(start){
  return this.sample(dt)
    .map(scale, dt/1000)
    .scan(start, add);
};
Bacon.Property.prototype.times = function(factor){
  return this.map(scale, factor);
};
Bacon.Property.prototype.plus  = function(property){
  return this.combine(property, add);
};

Bacon.Math = {};
Bacon.Math.sum = function(values, initial){
  return values.reduce(function(v, memo){
    return memo.combine(v, add);
  }, new Bacon.constant(initial));
};
