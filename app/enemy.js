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
