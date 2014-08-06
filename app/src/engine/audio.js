'use strict';

import Howl from 'howl';

function AudioPlayer(){
}
AudioPlayer.prototype.play = function(sound_name){
  var sound = new Howl({urls: ['audio/' + sound_name]});
  sound.play();

  return sound;
};

export default AudioPlayer;
