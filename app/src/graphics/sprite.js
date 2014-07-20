'use strict';

import Kinetic from 'kinetic';

function Sprite(){
  var width  = 10;
  var height = 10;

  this.shape = new Kinetic.Shape({
    x: 0,
    y: 0,
    width:  width,
    height: height,
    offset: {x: width/2, y: height/2},
    fill: 'black',

    drawFunc: function(context) {
      context.beginPath();
      context.moveTo( 0, 0);
      context.lineTo(10, 0);
      context.lineTo( 5, 12);
      context.closePath();
      context.fillStrokeShape(this);
    }
  });
  this.layer = new Kinetic.Layer();
  this.layer.add(this.shape);
}
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
