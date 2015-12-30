(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./enemy":2,"./player":3,"./rocket":4}],2:[function(require,module,exports){
'use strict';

/*
  Module: enemy
  Description: represents an enemy ship. Returns the necessary
    functions to operate the ship.
*/
var enemy = function() {
  var y = 30,
    x = Math.floor((Math.random() * 700) + 1),
    speed = 2,
    width = 30,
    height = 30;

  return {
    /*
      Function: getPosition
      Description: return the enemy's current position (x,y) as an object
    */
    getPosition: function() {
      return {
        x: x,
        y: y
      }
    },
    /*
      Function: move
      Description: increments the ships y coordinate by it's current speed
    */
    move: function() {
      // update position
      y += speed;
    },
    /*
      Function: draw
      Parameters: ctx - a canvas context
      Description: Draw the enemy ship at it's current position on the canvas.
    */
    draw: function(ctx) {
      // draw the ship
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (width/2), y - height);
      ctx.lineTo(x + (width/2), y - height);
      ctx.fill();
    },
    /*
      Function: isHit
      Parameters:
        xVal - x value (number)
        yVal - y value (number)
      Description: returns whether or not a the passed coordinates are in the
        enemy ship's collision box
    */
    isHit: function(xVal, yVal) {
      if ((xVal <= x + (width/2)) &&
          (xVal >= x - (width/2)) &&
          (yVal <= y) &&
          (yVal >= y - height)) {
        return true;
      }
      return false;
    },
    /*
      Function: isOutOfBounds
      Description: return whether or not the enemy ship has reached the end of
        the canvas.
    */
    isOutOfBounds: function() {
      return y >= 600 || y < 0;
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

module.exports = enemy;

},{}],3:[function(require,module,exports){
'use strict';

/*
  Module: player
  Description: represents the players ship. Can be initialized with an object.
    only x & y properties, but doesn't need to be. returns the necessary
    functions to operate the ship.
*/
var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20, score = 0, lives = 5, speed = 7;

  if (obj !== undefined && obj.width !== undefined) {
    width = obj.width;
  }

  if (obj !== undefined && obj.height !== undefined) {
    height = obj.height;
  }

  return {
    /*
      Function: loseLife
      Description: remove one life from the private variable lives.
    */
    loseLife: function() {
      if (lives > 0) {
        lives -= 1;
      }
    },
    /*
      Function: getLives
      Description: return number of remaining lives
    */
    getLives: function() {
      return lives;
    },
    /*
      Function: incrementScore
      Description: add one to the private score variable
    */
    incrementScore: function() {
      score += 1;
    },
    /*
      Function: getScore
      Description: return the current score
    */
    getScore: function() {
      return score;
    },
    /*
      Function: getPosition
      Description: return the players current position (x,y) as an object
    */
    getPosition: function() {
      return {
        x: x,
        y: y
      };
    },
    /*
      Function: moveLeft
      Description: decrements the players x value by the current speed (7)
    */
    moveLeft: function() {
      if (x >= 7) {
        x -= speed;
      }
    },
    /*
      Function: moveRight
      Description: increments the players x value by the current speed (7)
    */
    moveRight: function() {
      if (x <= 693) {
        x += speed;
      }
    },
    /*
      Function: draw
      Parameters: ctx - a canvas context
      Description: Draw the player at it's current position on the canvas.
    */
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
'use strict';

/*
  Module: rocket
  Parameters: object containing and x, y property representing the starting coordinates
  Description: represents a rocket fired by the player ship. Returns the
    necessary functions to operate the ship. Should be initialized with an
    object containing and x, y property representing the starting coordinates;
    otherwise the rocket starts at (0, 0)
*/
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
    /*
      Function: getPosition
      Description: return the rocket's current position (x,y) as an object
    */
    getPosition: function() {
      return {
        x: x,
        y: y
      };
    },
    /*
      Function: isExpired
      Description: return whether or not the rocket has reached the end of
        the canvas.
    */
    isExpired: function() {
      return y <= 0;
    },
    /*
      Function: move
      Description: descrments the rocket's y coordinate by it's current speed,
        moving it upwards on the canvas.
    */
    move: function() {
      y -= speed;
    },
    /*
      Function: draw
      Parameters: ctx - a canvas context
      Description: Draw the rocket at it's current position on the canvas.
    */
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
