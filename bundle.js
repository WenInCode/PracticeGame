(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ship = require('./player');

var main = (function() {

  // in es6 we could just declare these as const, but for now we will
  // declare them as private variables within the main module
  var canvas = document.createElement('canvas'),
    width = 700,
    height = 600,
    leftKey = 37,
    rightKet = 39,
    spaceKey = 32,
    ctx = canvas.getContext('2d'),
    move = {}
    player = ship({
      width: 20,
      height: 20,
      ctx: ctx
    });

  document.body.appendChild(canvas);

  // event listeners ----------------------------------
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === '37') {
      move['left'] = true;
    } else if (evt.keyCode === '39') {
      move['right'] = true;
    }
  });

  document.addEventListener('keyup', function(evt) {
    if (evt.keyCode === '37') {
      move['left'] = false;
    } else if (evt.keyCode === '39') {
      move['right'] = false;
    }
  });

  function gameLoop() {
    if (move['left']) {
      player.moveLeft();
    } else if (move['right']) {
      player.moveRight();
    }

    player.draw();
    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);
}());

},{"./player":2}],2:[function(require,module,exports){
var player = function(obj) {
  var x = 350, y = 500, width = 20, height = 20, ctx;

  if (obj.width !== undefined) {
    width = obj.width;
  }

  if (obj.height !== undefined) {
    height = obj.height;
  }

  if (obj.ctx !== undefined) {
    ctx = obj.ctx;
  }

  return {
    getX: function() {
      return x;
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
    draw: function() {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (width/2), y + height);
      ctx.lineTo(x + (width/2), y - height);
      ctx.fill();
    }
  };
};

module.exports = player;

},{}]},{},[1]);
