(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20;

  if (obj.width !== undefined) {
    width = obj.width;
  }

  if (obj.height !== undefined) {
    height = obj.height;
  }

  return {
    getPosition: function() {
      return {
        x: x,
        y: y
      };
    },
    moveLeft: function() {
      if (x >= 7) {
        x -= 7;
      }
    },
    moveRight: function() {
      if (x <= 693) {
        x += 7;
      }
    },
    draw: function(ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (width/2), y + height);
      ctx.lineTo(x + (width/2), y + height);
      ctx.fill();
    },
    _private: {
      setX: function(val) {
        if (val < 0) {
          x = 0;
        } else if (val > 700) {
          x = 700;
        } else {
          x = val;
        }
      }
    }
  };
};

module.exports = player;

},{}],2:[function(require,module,exports){
var player = require('../app/player');
//var app = require('../app/app');

QUnit.test("Module:Player - initializing", function(assert) {
  // create test player
  var testPlayer = player({
    width: 20,
    height: 20
  });

  // initial positions
  var position = testPlayer.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');
});

QUnit.test("Module:Player - moveRight", function(assert) {
  // create test player
  var testPlayer = player({
    width: 20,
    height: 20
  });

  // initial positions
  var position = testPlayer.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');

  testPlayer.moveRight();
  position = testPlayer.getPosition();
  assert.equal(position.x, 357, 'The initial x position of player should be 357');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');

  // test moveRight edge case
  testPlayer._private.setX(700)
  position = testPlayer.getPosition();
  assert.equal(position.x, 700, 'x should set to 700');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');
  testPlayer.moveRight();
  position = testPlayer.getPosition();
  assert.equal(position.x, 700, 'player x value cannot go passed 700');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');
});

QUnit.test("Module:Player - moveLeft", function(assert) {
  // create test player
  var testPlayer = player({
    width: 20,
    height: 20
  });

  // initial positions
  var position = testPlayer.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');

  testPlayer.moveLeft();
  position = testPlayer.getPosition();
  assert.equal(position.x, 343, 'The initial x position of player should be 343');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');

  // test moveRight edge case
  testPlayer._private.setX(0)
  position = testPlayer.getPosition();
  assert.equal(position.x, 0, 'x should set to 0');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');
  testPlayer.moveLeft();
  position = testPlayer.getPosition();
  assert.equal(position.x, 0, 'player x value cannot go below 0');
  assert.equal(position.y, 550, 'The player y position should be unchanged (550)');
});

},{"../app/player":1}]},{},[2]);
