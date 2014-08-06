'use strict';

import Sprite from 'engine/graphics/sprite';

function Text(options){
  this.options = options || {};
  this.init();
}
Text.prototype = Object.create(Sprite.prototype);
Text.prototype.init = function(){
  var self = this;

  this.shape = new Kinetic.Text({
    x: 0,
    y: 0,
    fill:       'black',
    text:       '',
    fontSize:   this.options.fontSize || 12,
    fontFamily: 'Share Tech Mono',
  });

};
Text.prototype.setText = function(text){
  this.shape.setText(text);
  this.alignText();
  this.shape.parent.draw();
};
Text.prototype.alignText = function(){
  switch(this.options.align){
    case 'center': this.shape.offsetX(this.shape.width()/2); break;
    case 'right':  this.shape.offsetX(this.shape.width()); break;
    case 'left':   this.shape.offsetX(0); break;
    default:
  }
}

export default Text;
