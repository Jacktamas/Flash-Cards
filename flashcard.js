var inquirer = require('inquirer');
var game = require('./controller/cliController.js');
var url = 'https://opentdb.com/api.php?amount=6&difficulty=easy&type=multiple&category=';

console.log('                               Welcome to my "FLASH CARDS" game! \n                       To start the game choose questions category\n                                   *** GOOD LUCK! ^_^ ***\n');
game.startGame();
