
'use strict';

import Bacon                            from 'Bacon';
import {Position2 as P2, Vector2 as V2} from 'core/vector';

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
  this.layers[layer_name].register(object);
};
Collisions.prototype.unregister = function(object, layer_name){
  this.layers[layer_name].unregister(object);
};


function CollisionLayer(){
  this.objects       = [];
  this.collides_with = [];
}
CollisionLayer.prototype.collideWith = function(layer){
  var contains = this.collides_with.reduce(function(memo, x){
    return memo || x === layer;
  }, false);

  if(!contains){
    this.collides_with.push(layer);
  }
};
CollisionLayer.prototype.register     = function(object){
  var other_objects = this.collides_with.reduce(function(memo, layer){
    return memo.concat(layer.objects);
  }, []);

  other_objects.forEach(function(other){
    var hits = collisions(object, other);

    var unsub_object = object.messages.plug(hits[0]);
    other.status.onEnd(unsub_object);

    var unsub_other  = other.messages.plug(hits[1]);
    object.status.onEnd(unsub_other);
  });

  this.objects.push(object);
};
CollisionLayer.prototype.unregister   = function(object){
  this.objects = this.objects.filter(function(x){
    return x !== object;
  });
};


function collisions(object1, object2){
  var position1 = object1.status.map('.position');
  var position2 = object2.status.map('.position');

  var distance = (object1.radius + object2.radius)/2;

  var hits = Bacon.combineAsArray(position1, position2)
    .filter(function(ps){
      return checkCollision(distance, ps[0], ps[1]);
    });

  var hits1 = hits.map(object2);
  var hits2 = hits.map(object1);

  return [hits1, hits2];
}
function checkCollision(distance, p1, p2){
  var between = V2.fromTo(p1,p2);
  return between.magnitude() < distance;
}


export default Collisions;
