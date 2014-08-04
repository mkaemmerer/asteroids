'use strict';

import Ship     from 'graphics/ship';
import Laser    from 'graphics/laser';
import Asteroid from 'graphics/asteroid';
import Text     from 'graphics/text';

function Graphics(stage, game){
  this.layer   = stage.addLayer();
  this.game    = game;
  this.gameEnd = this.game.flatMap('.start'); //The game is over when a new game begins

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


function HUDGraphics(stage, hud){
  this.layer   = stage.addLayer();
  this.hud     = hud;
  this.gameEnd = this.hud.flatMap('.start'); //The game is over when a new game begins

  this.hud.flatMap('.messages').onValue(this.drawMessage.bind(this));
  this.hud.flatMap('.score').onValue(this.drawScore.bind(this));
}
HUDGraphics.prototype.drawMessage = function(message){
  this.drawText(message, new Text());
};
HUDGraphics.prototype.drawScore   = function(score){
  this.drawText(score, new Text());
};
HUDGraphics.prototype.drawText    = function(hudObject, textObject){
  this.layer.add(textObject);
  var status = hudObject.status.takeUntil(this.gameEnd);

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

export { Graphics, HUDGraphics };
