'use strict';

import Bacon           from 'Bacon';
import {Input, KEYS}   from 'engine/core/input';
import {Vector2 as V2} from 'engine/core/vector';


function directional_keys(up, down, left, right){
  var moveUp    = Input.keystate(up).times(V2(0,1));
  var moveDown  = Input.keystate(down).times(V2(0,-1));
  var moveLeft  = Input.keystate(left).times(V2(-1,0));
  var moveRight = Input.keystate(right).times(V2(1,0));

  return Bacon.Math.sum([moveUp, moveDown, moveLeft, moveRight], V2.zero);
}

function autofire(key){
  return Input.keystate(key)
    .sample(1)
    .filter(function(x){ return x === 1; })
    .debounceImmediate(300);
}


var Controls = {};
Controls.NoControls = function(){
  return {
    direction: Bacon.constant(V2.zero),
    action:    Bacon.never()
  };
};
Controls.KeyboardControls = function(){
  return {
    direction: directional_keys(KEYS['Up'], KEYS['Down'], KEYS['Left'], KEYS['Right']),
    action:    autofire(KEYS['Space'])
  };
};


function Controller(controls){
  this._change   = new Bacon.Bus();

  this.direction = this._change
      .toProperty(controls || Controls.NoControls())
      .flatMapLatest('.direction');

  this.action    = this._change
      .toProperty(controls || Controls.NoControls())
      .flatMapLatest('.action');

  //Add a fake listener so that changes on the bus aren't lost
  this._change.onValue(function(){});
}
Controller.prototype.setControls = function(controls){
  this._change.push(controls);
};


export {Controls, Controller};
