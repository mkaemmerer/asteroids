'use strict';

import Sprite from 'engine/graphics/sprite';

function Asteroid(size){
  this.width  = 10*size;
  this.height = 10*size;

  this.init();
}
Asteroid.prototype = Object.create(Sprite.prototype);
Asteroid.prototype.draw = function(shape, context){
  var w = this.width;

  context.beginPath();
  context.arc(0, 0, w/2, 0, 2*Math.PI, true);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Asteroid;
