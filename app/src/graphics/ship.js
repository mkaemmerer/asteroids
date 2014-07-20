'use strict';

import Sprite from 'graphics/sprite';

function Ship(){
  this.width  = 12;
  this.height = 10;

  this.init();
}
Ship.prototype = Object.create(Sprite.prototype);
Ship.prototype.draw = function(shape, context){
  var w = this.width;
  var h = this.height;

  context.beginPath();
  context.moveTo( -w/2,  -h/2);
  context.lineTo( -w/2,   h/2);
  context.lineTo(  w/2,   0);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Ship;
