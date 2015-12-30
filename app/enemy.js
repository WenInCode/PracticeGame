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
