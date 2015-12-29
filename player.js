var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20, ctx;

  if (obj.width !== undefined) {
    width = obj.width;
  }

  if (obj.height !== undefined) {
    height = obj.height;
  }

  if (obj.ctx !== undefined) {
    ctx = obj.ctx;
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
    draw: function() {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (width/2), y + height);
      ctx.lineTo(x + (width/2), y + height);
      ctx.fill();
    }
  };
};

module.exports = player;
