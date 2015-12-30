var player = require('../app/player');
var rocket = require('../app/rocket');
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
