
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
Stage.prototype.add = function(sprite){
  this.canvas.add(sprite.layer);
};
Stage.prototype.remove = function(sprite){
  sprite.layer.destroy();
};

export default Stage;
