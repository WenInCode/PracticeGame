# PracticeGame
Small game, similar to space invaders. Used to practice using modules, and javascript sans framework.

## Install
This project is very small and doesn't use any package managers. I have gone the route of including qunit in the project.

To install run `git clone https://github.com/WenInCode/PracticeGame.git`

## Run
As of right now you can run the project by opening the `index.html` in a browser of your choice.

## Test
You can check the tests by opening the `test.html` in the browser of your choice.

## Modify
If you wish to modify the code you should have [browserify](http://browserify.org/) installed. 

You can do this by running: `npm install -g browserify` (assuming you have node installed)

If you wish to modify the code in the `app/` folder, remember to run the following commands to update the bundled code.

- `browserify app/app.js -o dist/bundle.js`
- `browserify tests/unbundled-tests.js -o tests/tests.js`
