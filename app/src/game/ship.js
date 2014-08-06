'use strict';

import Bacon                 from 'Bacon';
import __nothing__           from 'engine/core/calculus';
import {Vector2 as V2}       from 'engine/core/vector';
import {toWorldCoordinates}  from 'game/world';
import Laser                 from 'game/laser';

function Ship(pos, controls){
  this.collisions = new Bacon.Bus();
  this.radius     = 10;                  // px
  this.move_speed = 100;                 // px/s/s
  this.drag       = 0.5;                 // (unitless)
  this.turn_speed = 0.75 * (2*Math.PI);  // radians/s

  this._controls  = controls;
  this._start_pos = pos;

  var physics = Bacon.tie({
    acceleration: this.acceleration.bind(this),
    velocity:     this.velocity.bind(this),
    position:     this.position.bind(this),
    heading:      this.heading.bind(this),
    rotation:     this.rotation.bind(this)
  });
  var hit     = this.collisions.take(1);

  this.status  = Bacon.combineTemplate({
      position: physics.position,
      rotation: physics.rotation
    })
    .takeUntil(hit);
  this.fire    = controls.action
    .map(this.status)
    .takeUntil(hit);
  this.lasers  = this.fire
    .map(this.shoot.bind(this));
}

Ship.prototype.acceleration = function(physics){
  var thrust = this._controls.direction
    .map('.dy')
    .map(function(y){ return Math.max(y, 0); })
    .times(this.move_speed)
    .times(physics.heading);
  var drag   = physics.velocity
    .times(-this.drag);

  return Bacon.Math.sum([thrust, drag], V2.zero);
};
Ship.prototype.velocity     = function(physics){
  return physics.acceleration
    .integrate(V2.zero);
};
Ship.prototype.position     = function(physics){
  return physics.velocity
    .integrate(this._start_pos)
    .map(toWorldCoordinates);
};
Ship.prototype.heading      = function(physics){
  return physics.rotation
    .map(V2.fromRotation);
};
Ship.prototype.rotation     = function(physics){
  return this._controls.direction
    .map('.dx')
    .times(this.turn_speed)
    .integrate(-2*Math.PI/4)
    .skipDuplicates();
};

Ship.prototype.shoot = function(status){
  var laser = new Laser(status.position, status.rotation);
  return laser;
};

export default Ship;
