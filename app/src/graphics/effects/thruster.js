'use strict';

import Kinetic from 'kinetic';
import Sprite  from 'engine/graphics/sprite';

function Thruster(){
  this.shape    = new Kinetic.Group();
  this.position = {x: 0, y: 0};
  this.rotation = 0;
}
Thruster.prototype.spawn = function(){
  var group = new Kinetic.Group();
  group.position({
    x: this.position.x + -6*Math.cos(this.rotation),
    y: this.position.y + -6*Math.sin(this.rotation)
  });
  group.rotation((this.rotation*360/(2*Math.PI)) + (Math.random() - 0.5)*60);
  this.shape.add(group);

  var particle = new ThrusterParticle();
  group.add(particle.shape);

  var tween    = new Kinetic.Tween({
    node:      particle.shape,
    duration:  0.5,
    x:        -30,
    y:         0
  });
  tween.play();
  tween.onFinish = function(){
    tween.destroy();
    particle.destroy();
    group.destroy();
  };
};
Thruster.prototype.moveTo = function(p){
  this.position = p;
};
Thruster.prototype.rotateTo = function(radians){
  this.rotation = radians;
};
Thruster.prototype.destroy = function(){
  var parent = this.shape.parent;
  this.shape.destroy();
  parent.draw();
};


function ThrusterParticle(){
  this.width  = 2;
  this.height = 2;
  this.init();
}
ThrusterParticle.prototype      = Object.create(Sprite.prototype);
ThrusterParticle.prototype.draw = function(shape, context){
  var r = 1;

  context.beginPath();
  context.arc(0, 0, r, 0, 2*Math.PI, true);
  context.closePath();
  context.fillStrokeShape(shape);
};

export default Thruster;
