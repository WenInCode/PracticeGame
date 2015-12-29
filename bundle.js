(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ship = require('./player');
var rocket = require('./rocket');

var main = (function() {

  // in es6 we could just declare these as const, but for now we will
  // declare them as private variables within the main module
  var canvas = document.createElement('canvas'),
    width = 700,
    height = 600,
    leftKey = 37,
    rightKet = 39,
    spaceKey = 32,
    lastShot = 0,
    action = {
      left: false,
      right: false,
      shoot: false
    },
    rockets = new Array();

  // set up the canvas
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  var player = ship({
      width: 20,
      height: 20,
      ctx: ctx
    });

  // event listeners ----------------------------------
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 37) {
      action.left = true;
    } else if (evt.keyCode === 39) {
      action.right = true;
    } else if (evt.keyCode === 32) {
      action.shoot = true;
    }
  });

  document.addEventListener('keyup', function(evt) {
    if (evt.keyCode === 37) {
      action.left = false;
    } else if (evt.keyCode === 39) {
      action.right = false;
    } else if (evt.keyCode === 32) {
      action.shoot = false;
    }
  });

  function gameLoop() {

    // handle update all positions -------
    if (action.left) {
      player.moveLeft();
    } else if (action.right) {
      player.moveRight();
    }

    if (action.shoot && (Date.now() - lastShot > 500)) {
      console.log("shooting!!!");
      lastShot = Date.now();
      var pos = player.getPosition();
      rockets.push(rocket({
        x: pos.x,
        y: pos.y
      }));
    }

    // redraw all elements -----
    ctx.clearRect(0,0,canvas.width, canvas.height);
    player.draw();
    rockets.forEach(function(rocket, index, array) {
      rocket.update(ctx);
    });
    rockets = rockets.filter(function(rocket) {
      return !rocket.isExpired();
    });
    console.log(rockets.length);

    window.requestAnimationFrame(gameLoop, canvas);
  }
  window.requestAnimationFrame(gameLoop);
}());

},{"./player":2,"./rocket":3}],2:[function(require,module,exports){
var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20, ctx;

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
    draw: function() {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (width/2), y + height);
      ctx.lineTo(x + (width/2), y + height);
      ctx.fill();
    }
  };
};

module.exports = player;

},{}],3:[function(require,module,exports){
var rocket = function(obj) {
  var x = 0, y = 0, width = 5, height = 5, speed = 5;

  // initialize if the object is passed
  if (obj.x !== undefined) {
    x = obj.x;
  }
  if (obj.y !== undefined) {
    y = obj.y;
  }

  return {
    getPosition: function() {
      return {
        x: x,
        y: y
      };
    },
    isExpired: function() {
      return y <= 0;
    },
    update: function(ctx) {
      y -= speed;

      // use context to draw
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI*2, true);
      ctx.fill();
    }
  }
};

module.exports = rocket;

},{}]},{},[1]);
