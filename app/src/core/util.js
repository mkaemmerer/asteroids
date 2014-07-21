'use strict';

import Bacon from 'Bacon';

//Asteroids + their children + their children's children + ...
//TODO: is there a better name for this pattern?
Bacon.Observable.prototype.waterfall = function(f){
  var rest = this.map(f).flatMap(function(x){ return x.waterfall(f); });
  return this.merge(rest);
};
Bacon.Observable.prototype.end = function(){
  var END = {};
  return this.mapEnd(END).filter(function(x){ return x === END; });
};

export default {};