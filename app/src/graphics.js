'use strict';

import Stage    from 'graphics/stage';
import Ship     from 'graphics/ship';
import Laser    from 'graphics/laser';
import Asteroid from 'graphics/asteroid';

function Graphics(game){
  this.stage = new Stage({width: 400, height: 300, container: 'game'});

  game.ship.onValue(this.drawShip.bind(this));
  game.lasers.onValue(this.drawLaser.bind(this));
  game.asteroids.onValue(this.drawAsteroid.bind(this));
}
Graphics.prototype.drawShip = function(ship){
  var sprite = new Ship();

  this.stage.add(sprite);
  ship.status.map('.position').onValue(sprite.moveTo.bind(sprite));
  ship.status.map('.rotation').onValue(sprite.rotateTo.bind(sprite));
  ship.status.onEnd(sprite.destroy.bind(sprite));
};
Graphics.prototype.drawLaser = function(laser){
  var sprite = new Laser();

  this.stage.add(sprite);
  laser.status.map('.position').onValue(sprite.moveTo.bind(sprite));
  laser.status.map('.rotation').onValue(sprite.rotateTo.bind(sprite));
  laser.status.onEnd(sprite.destroy.bind(sprite));
};
Graphics.prototype.drawAsteroid = function(asteroid){
  var sprite = new Asteroid(asteroid.size);

  this.stage.add(sprite);
  asteroid.status.map('.position').onValue(sprite.moveTo.bind(sprite));
  asteroid.status.map('.rotation').onValue(sprite.rotateTo.bind(sprite));
  asteroid.status.onEnd(sprite.destroy.bind(sprite));
};

export default Graphics;
