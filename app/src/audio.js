'use strict';

function Audio(player, game){
  this.player  = player;
  this.game    = game;
  this.gameEnd = this.game.flatMap('.start'); //The game is over when a new game begins

  this.game.flatMap('.lasers').onValue(this.playLaserSound.bind(this));
  this.game.flatMap('.asteroids')
    .flatMap('.status.end')
    .onValue(this.playExplosionSound.bind(this));
  this.game.flatMap('.ships')
    .flatMap('.status.end')
    .onValue(this.playExplosionSound.bind(this));
}
Audio.prototype.playLaserSound = function(ship){
  this.player.play('laser.mp3');
};
Audio.prototype.playExplosionSound = function(laser){
  this.player.play('explode.mp3');
};

export default Audio;
