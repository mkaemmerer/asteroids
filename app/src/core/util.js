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
  return this.mapEnd(END).toEventStream().filter(function(x){ return x === END; });
};

Bacon.tie = function(strands){
  var knot = {};
  var key;

  for(key in strands){
    if(strands.hasOwnProperty(key)){
      knot[key] = new Bacon.Bus();
    }
  }
  for(key in strands){
    if(strands.hasOwnProperty(key)){
      var strand = strands[key];
      knot[key].plug(strand(knot));
    }
  }

  return knot;
};

export default {};
