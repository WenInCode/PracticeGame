'use strict';

var ship = require('./player');
var rocket = require('./rocket');
var enemy = require('./enemy');

/*
  small game, similar to space invaders.
  Module: main
  Description: the main module builds the games canvas and handles input.
    It leverages 3 other modules, ship, rocket & enemy.
*/
var main = (function() {

  // in es6 we could just declare these as const, but for now we will
  // declare them as private variables within the main module
  var canvas = document.createElement('canvas'),    // canvas object
    width = 700,          // canvas width
    height = 600,         // canvas height
    leftKey = 37,         // code for leftKey input
    rightKey = 39,        // code for rightKey input
    spaceKey = 32,        // code for spaceKey input
    lastShot = 0,         // holds the time of the last fired shot
    lastEnemy = 0,        // holds the time fo the last spawned enemy
    enemyTimer = 0,       // holds the delay between each spawned enemy
    gameOver = false,     // a logical flag for game over state
    action = {            // action object which holds 3 flags (1 per action)
      left: false,
      right: false,
      shoot: false
    },
    rockets = new Array(),  // holds all live rockets
    enemies = new Array(),  // holds all live enemies
    ctx,                  // holds the canvas context
    player;               // player object (ship)

  // event listeners for key down & key up -----------
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === leftKey) {
      action.left = true;
    } else if (evt.keyCode === rightKey) {
      action.right = true;
    } else if (evt.keyCode === spaceKey) {
      action.shoot = true;
    }
  });

  document.addEventListener('keyup', function(evt) {
    if (evt.keyCode === leftKey) {
      action.left = false;
    } else if (evt.keyCode === rightKey) {
      action.right = false;
    } else if (evt.keyCode === spaceKey) {
      action.shoot = false;
    }
  });
  // -------------------------------------------------

  /*
    function: init
    Description: builds the game canvas, initializes the player, and calls the
      game loop.
  */
  function init() {
    buildCanvas();

    player = ship({
        width: 20,
        height: 20
      });

    window.requestAnimationFrame(gameLoop);
  }

  /*
    function: buildCanvas
    Description: builds the game canvas
  */
  function buildCanvas() {
    // set up the canvas
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
  }

  /*
    function: endGame
    Description: sets the gameOver flag and adds the html game over message to
      the page
  */
  function endGame() {
    gameOver = true;
    var gameOverElement = document.createElement("h1");
    var gameOverText = document.createTextNode("Game Over!");
    gameOverElement.appendChild(gameOverText);
    document.body.appendChild(gameOverElement);
  }

  /*
    Function: spawnEnemy
    Description: called every game loop, this creates a new enemy ship after a
      random time delay
  */
  function spawnEnemy() {
    if (Date.now() - lastEnemy > enemyTimer) {
      lastEnemy = Date.now();
      enemyTimer = (Math.floor(Math.random() * 5000) + 1);
      enemies.push(enemy());
    }
  }

  /*
    Function: enemiesHit
    Description: checks if enemies have been hit by rockets, and if they have
      they are removed from the enemies array. The score is incremented after
      each hit.
  */
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
        updateScore();
      }

      return !hitFlag;
    });
  }

  /*
    Function: enemiesOutOfBounds
    Description: checks if enemies have left the bounds of the canvas. If so,
      they are removed from the enemies array and lives is decremented by one
  */
  function enemiesOutOfBounds() {
    // check which enemies made it through
    enemies = enemies.filter(function(e, index, array) {
      if (e.isOutOfBounds()) {
        updateLives();
        return false;
      } else {
        return true;
      }
    });
  }

  /*
    Function: updateLives
    Description: removes one life and updates the lives in html
  */
  function updateLives() {
    player.loseLife();
    document.getElementById("lives").innerHTML = "<strong>Lives:</strong> " + player.getLives();
    if (player.getLives() <= 0) {
      endGame();
    }
  }

  /*
    Function: updateScore
    Description: increments the score and updates the score in html
  */
  function updateScore() {
    player.incrementScore();
    document.getElementById("score").innerHTML = "<strong>Score:</strong> " + player.getScore();
  }

  /*
    Function: updatePlayer
    Description: moves the player if necessary, and  then draws the player on
      the canvas.
  */
  function updatePlayer() {
    if (action.left) {
      player.moveLeft();
    } else if (action.right) {
      player.moveRight();
    }

    player.draw(ctx);
  }

  /*
    Function: updateRockets
    Description: moves the rockets and checks if they have expireed. If they
      have not expired, draw them.
  */
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

  /*
    Function: updateEnemies
    Description: moves each enemy ship then checks if they have either been hit
      by rockets or have gone out of the canvas bounds. If neither of these
      conditions are true, the ship is drawn on the canvas.
  */
  function updateEnemies() {
    enemies.forEach(function(e) {
      e.move();
    });
    enemiesHit();
    enemiesOutOfBounds();
    enemies.forEach(function(e) {
      e.draw(ctx);
    });
  }

  /*
    Function: handleShooting
    Description: if there hasn't been a shot in the last 0.5 seconds and the
      user is trying to shoot, it creates a rocket and adds it to rockets array,
      resets the lastShot time.
  */
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

  /*
    Function: gameLoop
    Description: while the game is not over continue looping. clears the canvas,
      and calls all the necessary functions for updating the game state.
  */
  function gameLoop() {
    if (!gameOver) {
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
  }

  /*
    Here I originally wanted to just return the init function publically, but
    that raised issues when it came to testing, so I added all of the private
    functions under '_private'.
  */
  return {
    init: init,
    _private: {
      gameLoop: gameLoop,
      buildCanvas: buildCanvas,
      spawnEnemy: spawnEnemy,
      enemiesHit: enemiesHit,
      enemiesOutOfBounds: enemiesOutOfBounds,
      handleShooting: handleShooting,
      updatePlayer: updatePlayer,
      updateEnemies: updateEnemies,
      updateRockets: updateRockets
    }
  };
});

module.exports = main;

var app = main();
app.init();
