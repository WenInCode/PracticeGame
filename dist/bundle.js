(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ship = require('./player');
var rocket = require('./rocket');
var enemy = require('./enemy');

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
    lastEnemy = 0,
    enemyTimer = 0,
    score = 0,
    lives = 5,
    action = {
      left: false,
      right: false,
      shoot: false
    },
    rockets = new Array(),
    enemies = new Array(),
    ctx,
    player;

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
  // -------------------------------------------------

  function init() {
    buildCanvas();

    player = ship({
        width: 20,
        height: 20
      });

    window.requestAnimationFrame(gameLoop);
  }

  function buildCanvas() {
    // set up the canvas
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
  }

  function spawnEnemy() {
    if (Date.now() - lastEnemy > enemyTimer) {
      lastEnemy = Date.now();
      enemyTimer = (Math.floor(Math.random() * 5000) + 1);
      enemies.push(enemy());
    }
  }

  function moveEnemies() {
    enemies.forEach(function(e) {
      e.update(ctx);
    });
  }

  function filterEnemies() {
    enemiesHit();
    enemiesOutOfBounds();
  }

  function enemiesHit() {
    // check which enemies are hit
    enemies = enemies.filter(function(e, index, array) {
      var hitFlag = false;

      rockets = rockets.filter(function(rkt, i, r) {
        var currentPosition = rkt.getPosition();
        if (e.isHit(currentPosition.x, currentPosition.y)) {
          hitFlag = true;
          return false;
        }
        return true;
      });

      if (hitFlag) {
        score += 1;
      }

      return !hitFlag;
    });
  }

  function enemiesOutOfBounds() {
    // check which enemies made it through
    enemies = enemies.filter(function(e, index, array) {
      if (e.isOutOfBounds()) {
        lives -= 1;
        if (lives <= 0) {
          // exit
        }
        console.log(lives);
        return false;
      } else {
        return true;
      }
    });
  }

  function updatePlayer() {
    if (action.left) {
      player.moveLeft();
    } else if (action.right) {
      player.moveRight();
    }

    player.draw(ctx);
  }

  function updateRockets() {
    rockets.forEach(function(rkt, index, array) {
      rkt.move();
    });

    rockets = rockets.filter(function(rkt) {
      return !rkt.isExpired();
    });

    rockets.forEach(function(rkt, index, array) {
      rkt.draw(ctx);
    });
  }

  function updateEnemies() {
    moveEnemies();
    filterEnemies();
  }

  function handleShooting() {
    if (action.shoot && (Date.now() - lastShot > 500)) {
      console.log("shooting!!!");
      lastShot = Date.now();
      var pos = player.getPosition();
      rockets.push(rocket({
        x: pos.x,
        y: pos.y
      }));
    }
  }

  function gameLoop() {
    spawnEnemy();
    handleShooting();

    // redraw all elements -----
    ctx.clearRect(0,0,canvas.width, canvas.height);

    updatePlayer();
    updateRockets();
    updateEnemies();
    // call for a new frame
    window.requestAnimationFrame(gameLoop, canvas);
  }

  return {
    init: init,
    _private: {
      gameLoop: gameLoop,
      buildCanvas: buildCanvas,
      spawnEnemy: spawnEnemy,
      moveEnemies: moveEnemies,
      filterEnemies: filterEnemies,
      enemiesHit: enemiesHit,
      enemiesOutOfBounds: enemiesOutOfBounds,
      handleShooting: handleShooting,
      updateRockets: updateRockets
    }
  };
});

module.exports = main;

var app = main();
app.init();

},{"./enemy":2,"./player":3,"./rocket":4}],2:[function(require,module,exports){
var enemy = function() {
  var y = 30,
    x = Math.floor((Math.random() * 700) + 1),
    speed = 2,
    width = 30,
    height = 30;

  return {
    getPosition: function() {
      return {
        x: x,
        y: y
      }
    },
    update: function(ctx) {
      // update position
      y += speed;

      // draw the ship
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (width/2), y - height);
      ctx.lineTo(x + (width/2), y - height);
      ctx.fill();
    },
    isHit: function(xVal, yVal) {
      if ((xVal <= x + (width/2)) &&
          (xVal >= x - (width/2)) &&
          (yVal <= y) &&
          (yVal >= y - height)) {
        return true;
      }
      return false;
    },
    isOutOfBounds: function() {
      return y >= 600;
    }
  }
};

module.exports = enemy;

},{}],3:[function(require,module,exports){
var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20;

  if (obj !== undefined && obj.width !== undefined) {
    width = obj.width;
  }

  if (obj !== undefined && obj.height !== undefined) {
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

},{}],4:[function(require,module,exports){
var rocket = function(obj) {
  var x = 0,
    y = 0,
    width = 5,
    height = 5,
    speed = 5;

  // initialize if the object is passed
  if (obj !== undefined && obj.x !== undefined) {
    x = obj.x;
  }
  if (obj !== undefined && obj.y !== undefined) {
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
    move: function() {
      y -= speed;
    },
    draw: function(ctx) {
      // use context to draw
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI*2, true);
      ctx.fill();
    },
    _private: {
      setY: function(val) {
        if (val !== undefined && typeof val === 'number') {
          y = val;
        }
      }
    }
  }
};

module.exports = rocket;

},{}]},{},[1]);
