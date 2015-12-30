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
