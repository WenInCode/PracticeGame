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
