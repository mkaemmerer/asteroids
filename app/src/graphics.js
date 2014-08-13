'use strict';

import Text      from 'engine/graphics/text';
import Ship      from 'graphics/ship';
import Laser     from 'graphics/laser';
import Asteroid  from 'graphics/asteroid';
import Explosion from 'graphics/effects/explosion';
import Thruster  from 'graphics/effects/thruster';

function Graphics(stage, game){
  this.layer   = stage.addLayer();
  this.game    = game;
  this.newGame = this.game.flatMap('.start'); //The game is over when a new game begins

  this.game.flatMap('.ships').onValue(this.drawShip.bind(this));
  this.game.flatMap('.lasers').onValue(this.drawLaser.bind(this));
  this.game.flatMap('.asteroids').onValue(this.drawAsteroid.bind(this));
}
Graphics.prototype.drawShip = function(ship){
  this.drawSprite(ship, new Ship());
};
Graphics.prototype.drawLaser = function(laser){
  this.drawSprite(laser, new Laser());
};
Graphics.prototype.drawAsteroid = function(asteroid){
  this.drawSprite(asteroid, new Asteroid(asteroid.size));
};
Graphics.prototype.drawSprite = function(gameObject, sprite){
  this.layer.add(sprite);
  var status = gameObject.status.takeUntil(this.newGame);

  status
    .map('.position')
    .onValue(sprite.moveTo.bind(sprite));
  status
    .map('.rotation')
    .onValue(sprite.rotateTo.bind(sprite));
  status
    .onEnd(sprite.destroy.bind(sprite));
};


function Effects(stage, game){
  this.layer   = stage.addLayer();
  this.game    = game;
  this.newGame = this.game.flatMap('.start');

  this.game.flatMap('.asteroids')
    .flatMap('.status.end')
    .onValue(this.drawExplosion.bind(this));
  this.game.flatMap('.ships')
    .flatMap('.status.end')
    .onValue(this.drawExplosion.bind(this));
  this.game.flatMap('.ships')
    .onValue(this.drawThruster.bind(this));
}
Effects.prototype.drawExplosion = function(exploded){
  var explosion = new Explosion();
  this.layer.add(explosion);
  explosion.animate();

  Bacon.once(exploded.position)
    .onValue(explosion.moveTo.bind(explosion));
  Bacon.later(750)
    .onValue(explosion.destroy.bind(explosion));
};
Effects.prototype.drawThruster = function(ship){
  var thruster = new Thruster();
  this.layer.add(thruster);
  var status = ship.status.takeUntil(this.newGame);

  status
    .map('.position')
    .onValue(thruster.moveTo.bind(thruster));
  status
    .map('.rotation')
    .onValue(thruster.rotateTo.bind(thruster));
  Bacon.interval(1000/10)
    .filter(ship.thrust)
    .takeUntil(status.end())
    .onValue(thruster.spawn.bind(thruster));
  status
    .delay(1000)
    .onEnd(thruster.destroy.bind(thruster));
};


function HUDGraphics(stage, hud){
  this.layer   = stage.addLayer();
  this.hud     = hud;
  this.newGame = this.hud.flatMap('.start'); //The game is over when a new game begins

  this.hud.flatMap('.messages').onValue(this.drawMessage.bind(this));
  this.hud.flatMap('.score').onValue(this.drawStatus.bind(this));
  this.hud.flatMap('.lives').onValue(this.drawStatus.bind(this));
}
HUDGraphics.prototype.drawMessage = function(message){
  this.drawText(message, new Text({ align: 'center', fontSize: 40 }));
};
HUDGraphics.prototype.drawStatus  = function(status){
  this.drawText(status, new Text({ align: 'left', fontSize: 20 }));
};
HUDGraphics.prototype.drawText    = function(hudObject, textObject){
  this.layer.add(textObject);
  var status = hudObject.status.takeUntil(this.newGame);

  status
    .map('.position')
    .onValue(textObject.moveTo.bind(textObject));
  status
    .map('.rotation')
    .onValue(textObject.rotateTo.bind(textObject));
  status
    .map('.text')
    .onValue(textObject.setText.bind(textObject));
  status
    .onEnd(textObject.destroy.bind(textObject));
};

export { Graphics, Effects, HUDGraphics };
