'use strict';

import Sprite from 'engine/graphics/sprite';

function Laser(){
  this.width  = 10;
  this.height = 2;

  this.init();
}
Laser.prototype = Object.create(Sprite.prototype);
Laser.prototype.draw = function(shape, context){
  var w = this.width;
  var h = this.height;

  context.beginPath();
  context.moveTo( -w/2, -h/2);
  context.lineTo(  w/2, -h/2);
  context.lineTo(  w/2,  h/2);
  context.lineTo( -w/2,  h/2);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Laser;
