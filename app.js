var ship = require('./player');
var rocket = require('./rocket');

var main = (function() {

  // in es6 we could just declare these as const, but for now we will
  // declare them as private variables within the main module
  var canvas = document.createElement('canvas'),
    width = 700,
    height = 600,
    leftKey = 37,
    rightKet = 39,
    spaceKey = 32,
    lastShot = 0,
    action = {
      left: false,
      right: false,
      shoot: false
    },
    rockets = new Array();

  // set up the canvas
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  var player = ship({
      width: 20,
      height: 20,
      ctx: ctx
    });

  // event listeners ----------------------------------
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 37) {
      action.left = true;
    } else if (evt.keyCode === 39) {
      action.right = true;
    } else if (evt.keyCode === 32) {
      action.shoot = true;
    }
  });

  document.addEventListener('keyup', function(evt) {
    if (evt.keyCode === 37) {
      action.left = false;
    } else if (evt.keyCode === 39) {
      action.right = false;
    } else if (evt.keyCode === 32) {
      action.shoot = false;
    }
  });

  function gameLoop() {

    // handle update all positions -------
    if (action.left) {
      player.moveLeft();
    } else if (action.right) {
      player.moveRight();
    }

    if (action.shoot && (Date.now() - lastShot > 500)) {
      console.log("shooting!!!");
      lastShot = Date.now();
      var pos = player.getPosition();
      rockets.push(rocket({
        x: pos.x,
        y: pos.y
      }));
    }

    // redraw all elements -----
    ctx.clearRect(0,0,canvas.width, canvas.height);
    player.draw();
    rockets.forEach(function(rocket, index, array) {
      rocket.update(ctx);
    });
    rockets = rockets.filter(function(rocket) {
      return !rocket.isExpired();
    });

    // call for a new frame
    window.requestAnimationFrame(gameLoop, canvas);
  }
  window.requestAnimationFrame(gameLoop);
}());
