'use strict';

import {Position2 as P2} from 'core/vector';
import {Controls}        from 'game/controls';
import Ship              from 'game/ship';

import Stage             from 'graphics/stage';
import Sprite            from 'graphics/sprite';

console.log('Starting game...');

var controls = Controls.KeyboardControls();
var ship     = new Ship(P2(0,0), controls);

var stage    = new Stage({width: 400, height: 300, container: 'game'});
var sprite   = new Sprite();

stage.add(sprite);
ship.status.map('.position').onValue(sprite.moveTo.bind(sprite));
ship.status.map('.rotation').onValue(sprite.rotateTo.bind(sprite));
