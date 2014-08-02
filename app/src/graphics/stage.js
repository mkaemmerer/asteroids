'use strict';

import Kinetic from 'kinetic';

function Stage(options){
  this.width  = options.width;
  this.height = options.height;

  this.canvas  = new Kinetic.Stage({
    container: options.container,
    width:  this.width,
    height: this.height
  });
}
Stage.prototype.addLayer = function(){
  var layer = new Layer();
  this.canvas.add(layer.layer);

  return layer;
};


function Layer(){
  this.layer = new Kinetic.Layer();
}
Layer.prototype.add = function(sprite){
  this.layer.add(sprite.shape);
  this.layer.draw();
};
Layer.prototype.remove = function(sprite){
  sprite.shape.destroy();
  this.layer.draw();
};

export default Stage;
