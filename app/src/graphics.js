'use strict';

import Stage    from 'graphics/stage';
import Ship     from 'graphics/ship';
import Laser    from 'graphics/laser';
import Asteroid from 'graphics/asteroid';

function Graphics(game){
  this.stage   = new Stage({width: 400, height: 300, container: 'game'});
  this.game    = game;
  this.gameEnd = this.game.flatMap('.start');

  this.game.flatMap('.ship').onValue(this.drawShip.bind(this));
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
  this.stage.add(sprite);
  var status = gameObject.status.takeUntil(this.gameEnd);

  status
    .map('.position')
    .onValue(sprite.moveTo.bind(sprite));
  status
    .map('.rotation')
    .onValue(sprite.rotateTo.bind(sprite));
  status
    .onEnd(sprite.destroy.bind(sprite));
};


export default Graphics;
