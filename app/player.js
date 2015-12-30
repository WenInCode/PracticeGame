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
