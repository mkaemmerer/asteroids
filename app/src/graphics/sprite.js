'use strict';

import Kinetic from 'kinetic';

function Sprite(){
  this.width  = 10;
  this.height = 10;

  this.init();
}
Sprite.prototype.init = function(){
  var self = this;

  this.shape = new Kinetic.Shape({
    x: 0,
    y: 0,
    width:  this.width,
    height: this.height,
    offset: {x: this.width/2, y: this.height/2},
    fill: 'black',
    drawFunc: function(context){ self.draw(this, context); }
  });
  this.layer = new Kinetic.Layer();
  this.layer.add(this.shape);
};
Sprite.prototype.draw = function(){
  throw new Error('abstract method');
};
Sprite.prototype.moveTo = function(p){
  this.shape.position(p);
  this.layer.draw();
};
Sprite.prototype.rotateTo = function(radians){
  var degrees = 360*radians/(2*Math.PI);

  this.shape.rotation(degrees);
  this.layer.draw();
};
Sprite.prototype.destroy = function(){
  this.layer.destroy();
};

export default Sprite;
