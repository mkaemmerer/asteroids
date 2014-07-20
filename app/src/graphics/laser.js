'use strict';

import Sprite from 'graphics/sprite';

function Laser(){
  this.width  = 2;
  this.height = 10;

  this.init();
}
Laser.prototype = Object.create(Sprite.prototype);
Laser.prototype.draw = function(shape, context){
  var w = this.width;
  var h = this.height;

  context.beginPath();
  context.moveTo( 0, 0);
  context.lineTo( w, 0);
  context.lineTo( w, h);
  context.lineTo( 0, h);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Laser;
