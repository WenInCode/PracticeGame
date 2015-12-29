var ship = require('./player');

var main = (function() {

  // in es6 we could just declare these as const, but for now we will
  // declare them as private variables within the main module
  var canvas = document.createElement('canvas'),
    width = 700,
    height = 600,
    leftKey = 37,
    rightKet = 39,
    spaceKey = 32,
    ctx = canvas.getContext('2d'),
    move = {}
    player = ship({
      width: 20,
      height: 20,
      ctx: ctx
    });

  document.body.appendChild(canvas);

  // event listeners ----------------------------------
  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === '37') {
      move['left'] = true;
    } else if (evt.keyCode === '39') {
      move['right'] = true;
    }
  });

  document.addEventListener('keyup', function(evt) {
    if (evt.keyCode === '37') {
      move['left'] = false;
    } else if (evt.keyCode === '39') {
      move['right'] = false;
    }
  });

  function gameLoop() {
    if (move['left']) {
      player.moveLeft();
    } else if (move['right']) {
      player.moveRight();
    }

    player.draw();
    window.requestAnimationFrame(gameLoop);
  }
  window.requestAnimationFrame(gameLoop);
}());
