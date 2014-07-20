'use strict';

import Sprite from 'graphics/sprite';

function Ship(){
  this.width  = 10;
  this.height = 12;

  this.init();
}
Ship.prototype = Object.create(Sprite.prototype);
Ship.prototype.draw = function(shape, context){
  var w = this.width;
  var h = this.height;

  context.beginPath();
  context.moveTo( 0,   0);
  context.lineTo( w,   0);
  context.lineTo( w/2, h);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Ship;
