(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var player = require('../app/player');
var rocket = require('../app/rocket');
var enemy = require('../app/enemy');
//var app = require('../app/app');

// -- START PLAYER TESTS ----------------
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

  testPlayer = player();
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

// -- END PLAYER TESTS ----------------

// -- START ROCKET TESTS ----------------
QUnit.test("Module:Rocket - initializing", function(assert) {
  // create test player
  var testRocket = rocket({
    x: 350,
    y: 550
  });

  // initial positions
  var position = testRocket.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');

  testRocket = rocket();
  var position = testRocket.getPosition();
  assert.equal(position.x, 0, 'The initial x position of player should be 0');
  assert.equal(position.y, 0, 'The initial y position of player should be 0');
});

QUnit.test("Module:Rocket - move", function(assert) {
  // create test player
  var testRocket = rocket({
    x: 350,
    y: 550
  });

  // initial positions
  var position = testRocket.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');

  // move the rocket
  testRocket.move();
  var position = testRocket.getPosition();
  assert.equal(position.x, 350, 'player x position should remain unchanged (350)');
  assert.equal(position.y, 545, 'The initial y position of player should be 545');
});

QUnit.test("Module:Rocket - isExpired", function(assert) {
  // create test player
  var testRocket = rocket({
    x: 350,
    y: 550
  });

  // initial positions
  var position = testRocket.getPosition();
  assert.equal(position.x, 350, 'The initial x position of player should be 350');
  assert.equal(position.y, 550, 'The initial y position of player should be 550');
  assert.ok(!testRocket.isExpired(), 'Should return false');

  // set rocket y < 0
  testRocket._private.setY(-2);
  var position = testRocket.getPosition();
  assert.equal(position.x, 350, 'player x position should remain unchanged (350)');
  assert.equal(position.y, -2, 'The initial y position of player should be -2');
  assert.ok(testRocket.isExpired(), 'Should return true');
});
// -- END ROCKET TESTS ----------------

// -- START ENEMY TESTS ----------------
QUnit.test("Module:Enemy - initializing", function(assert) {
  // create test player
  var testEnemy = enemy();

  // initial positions
  var position = testEnemy.getPosition();
  assert.ok((position.x >= 0 && position.x <= 700), 'The initial x position should be between 0 & 700');
  assert.equal(position.y, 30, 'The initial y position of enemy should be 30');
});

QUnit.test("Module:Enemy - move", function(assert) {
  // create test player
  var testEnemy = enemy();

  // initial positions
  var position = testEnemy.getPosition();
  assert.ok((position.x >= 0 && position.x <= 700), 'The initial x position should be between 0 & 700');
  assert.equal(position.y, 30, 'The initial y position of enemy should be 30');

  var initialX = position.x;
  testEnemy.move();
  position = testEnemy.getPosition();
  assert.equal(position.x, initialX, 'x should not change');
  assert.equal(position.y, 32, 'y should now be 32');
});

QUnit.test("Module:Enemy - isOutOfBounds", function(assert) {
  // create test player
  var testEnemy = enemy();

  // initial positions
  var position = testEnemy.getPosition();
  assert.ok((position.x >= 0 && position.x <= 700), 'The initial x position should be between 0 & 700');
  assert.equal(position.y, 30, 'The initial y position of enemy should be 30');
  assert.ok(!testEnemy.isOutOfBounds(), 'Enemy should be in bounds');

  testEnemy._private.setY(602);
  position = testEnemy.getPosition();
  assert.equal(position.y, 602, 'y should now be 32');
  assert.ok(testEnemy.isOutOfBounds(), 'Enemy out of bounds is true');

  testEnemy._private.setY(-2);
  position = testEnemy.getPosition();
  assert.equal(position.y, -2, 'y should now be -2');
  assert.ok(testEnemy.isOutOfBounds(), 'Enemy out of bounds is true');
});
// -- END ENEMY TESTS ----------------

},{"../app/enemy":1,"../app/player":2,"../app/rocket":3}]},{},[4]);
