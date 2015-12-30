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
