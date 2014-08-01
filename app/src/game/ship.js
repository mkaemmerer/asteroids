'use strict';

import __nothing__                      from 'core/calculus';
import Bacon                            from 'Bacon';
import {Position2 as P2, Vector2 as V2} from 'core/vector';
import {toWorldCoordinates}             from 'game/world';
import Laser                            from 'game/laser';

function Ship(pos, controls){
  this.collisions = new Bacon.Bus();
  this.radius     = 10;                  // px
  this.move_speed = 100;                 // px/s/s
  this.drag       = 0.5;                 // (unitless)
  this.turn_speed = 0.75 * (2*Math.PI);  // radians/s

  this._controls  = controls;
  this._start_pos = pos;

  var hit  = this.collisions.take(1);
  var knot = Bacon.tie({
    acceleration: this.acceleration.bind(this),
    velocity:     this.velocity.bind(this),
    position:     this.position.bind(this),
    heading:      this.heading.bind(this),
    rotation:     this.rotation.bind(this)
  });

  this.status  = Bacon.combineTemplate({
      position: knot.position,
      rotation: knot.rotation
    })
    .takeUntil(hit);
  this.fire    = controls.action
    .map(this.status)
    .takeUntil(hit);
  this.lasers  = this.fire
    .map(this.shoot.bind(this));
}

Ship.prototype.acceleration = function(knot){
  var thrust = this._controls.direction
    .map('.dy')
    .map(function(y){ return Math.max(y, 0); })
    .times(this.move_speed)
    .times(knot.heading);
  var drag   = knot.velocity
    .times(-this.drag);

  return Bacon.Math.sum([thrust, drag], V2.zero);
};
Ship.prototype.velocity     = function(knot){
  return knot.acceleration
    .integrate(V2.zero);
};
Ship.prototype.position     = function(knot){
  return knot.velocity
    .integrate(this._start_pos)
    .map(toWorldCoordinates);
};
Ship.prototype.heading      = function(knot){
  return knot.rotation
    .map(V2.fromRotation);
};
Ship.prototype.rotation     = function(knot){
  return this._controls.direction
    .map('.dx')
    .times(this.turn_speed)
    .integrate(0)
    .skipDuplicates();
};

Ship.prototype.shoot = function(status){
  var laser = new Laser(status.position, status.rotation);
  return laser;
};

export default Ship;
