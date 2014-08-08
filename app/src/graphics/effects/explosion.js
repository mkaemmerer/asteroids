'use strict';

import Kinetic from 'kinetic';
import Sprite  from 'engine/graphics/sprite';

function Explosion(){
  this.shape = new Kinetic.Group();
}
Explosion.prototype.animate = function(){
  for(var i=0; i<8; i++){
    var particle = new ExplosionParticle();
    this.shape.add(particle.shape);

    var tween    = new Kinetic.Tween({
      node:     particle.shape,
      duration: 1.5,
      easing:   Kinetic.Easings.EaseOut,
      x:        50 * Math.cos(i*(2*Math.PI/8)),
      y:        50 * Math.sin(i*(2*Math.PI/8))
    });
    tween.play();
    tween.onFinish = function(){ tween.destroy(); };

  }
};
Explosion.prototype.moveTo = function(p){
  this.shape.position(p);
  this.shape.parent.draw();
}
Explosion.prototype.destroy = function(){
  var parent = this.shape.parent;
  this.shape.destroy();
  parent.draw();
};


function ExplosionParticle(){
  this.width  = 2;
  this.height = 2;
  this.init();
}
ExplosionParticle.prototype      = Object.create(Sprite.prototype);
ExplosionParticle.prototype.draw = function(shape, context){
  var r = 1;

  context.beginPath();
  context.arc(0, 0, r, 0, 2*Math.PI, true);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Explosion;
