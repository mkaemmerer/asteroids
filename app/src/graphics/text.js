'use strict';

import Sprite from 'graphics/sprite';

function Text(){
  this.init();
}
Text.prototype = Object.create(Sprite.prototype);
Text.prototype.init = function(){
  var self = this;

  this.shape = new Kinetic.Text({
    x: 0,
    y: 0,
    align:      this.align || 'center',
    fill:       'black',
    text:       '',
    fontSize:   30,
    fontFamily: 'Share Tech Mono',
  });
};
Text.prototype.setText = function(text){
  this.shape.setText(text);
  this.shape.parent.draw();
};

export default Text;
