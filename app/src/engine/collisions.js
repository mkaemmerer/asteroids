'use strict';

import Bacon           from 'Bacon';
import {Vector2 as V2} from 'engine/core/vector';

function Collisions(layer_info){
  this.layers = {};

  var self = this;
  for(var layer_name in layer_info){
    if(layer_info.hasOwnProperty(layer_name)){
      this.layers[layer_name] = new CollisionLayer();
    }
  }
  for(var name in this.layers){
    if(this.layers.hasOwnProperty(name)){
      var layer = this.layers[name];

      layer_info[name].forEach(function(other_name){
        var other = self.layers[other_name];
        layer.collideWith(other);
        other.collideWith(layer);
      });
    }
  }
}
Collisions.prototype.register   = function(object, layer_name){
  return this.layers[layer_name].register(object);
};
Collisions.prototype.unregister = function(object, layer_name){
  this.layers[layer_name].unregister(object);
};


function CollisionLayer(){
  this.collides_with = [];

  this.adds    = new Bacon.Bus();
  this.removes = new Bacon.Bus();
  this.objects = Bacon.update([],
      this.adds,    function(arr, x){ return arr.concat(x); },
      this.removes, function(arr, x){ return arr.filter(function(y){ return y !== x; }); }
    );

  //Make sure the objects in this layer stay up-to-date even when there is no one listening
  this.objects.onValue(function(){});
}
CollisionLayer.prototype.collideWith = function(layer){
  function flatten(arrays){
    return [].concat.apply([], arrays);
  }

  if(this.collides_with.indexOf(layer) === -1){
    this.collides_with.push(layer);
    this.other_objects = Bacon.combineAsArray(this.collides_with
      .map(function(layer){ return layer.objects; })
    ).map(flatten);
  }
};
CollisionLayer.prototype.register     = function(object){
  var hits = this.getCollisions(object);
  this.adds.push(object);
  return hits;
};
CollisionLayer.prototype.unregister   = function(object){
  this.removes.push(object);
};
CollisionLayer.prototype.getCollisions = function(object){
  var removed = this.removes.filter(function(x){ return x === object; });
  var hits    = this.other_objects.flatMapLatest(function(others){
      return Bacon.mergeAll(others
        .map(function(other){ return collisions(object, other); })
      );
    })
    .takeUntil(removed);

  return hits;
};


function collisions(object1, object2){
  var position1 = object1.status.map('.position');
  var position2 = object2.status.map('.position');

  var distance = (object1.radius + object2.radius)/2;
  var hits     = Bacon.combineWith(checkCollision(distance), position1, position2)
    .filter(function(isHit){ return isHit; });

  return hits.map(object2);
}
function checkCollision(distance){
  return function(p1, p2){
    var between = V2.fromTo(p1,p2);
    return between.magnitude() < distance;
  };
}


export default Collisions;
