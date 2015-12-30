var player = function(obj) {
  var x = 350, y = 550, width = 20, height = 20, score = 0, lives = 5;

  if (obj !== undefined && obj.width !== undefined) {
    width = obj.width;
  }

  if (obj !== undefined && obj.height !== undefined) {
    height = obj.height;
  }

  return {
    loseLife: function() {
      if (lives > 0) {
        lives -= 1;
      }
    },
    getLives: function() {
      return lives;
    },
    incrementScore: function() {
      score += 1;
    },
    getScore: function() {
      return score;
    },
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
