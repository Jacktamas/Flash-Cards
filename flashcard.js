var inquirer = require('inquirer');
var game = require('./controller/cliController.js');
var url = 'https://opentdb.com/api.php?amount=6&difficulty=easy&type=multiple&category=';

console.log('Welcome to my Flash Cards game! \n to start the game choose questions category, GOOD LUCK!');
inquirer.prompt([
  {
    type: 'list',
    name: 'category',
    message: 'Choose your questions category:',
    choices: ['General Knowledge', 'Film', 'Music', 'Science & Nature', 'Science: Computers']
  }
]).then(function(answer){
  switch (answer.category) {
    case 'General Knowledge':
    game.gameInit(url,9);
    break;

    case 'Film':
    game.gameInit(url,11);
    break;

    case 'Music':
    game.gameInit(url,12);
    break;

    case 'Science & Nature':
    game.gameInit(url,17);
    break;
    case 'Science: Computers':
    game.gameInit(url,18)
    break;
  }
  inquirer.prompt([
    {
      type: 'input',
      name: 'userName',
      message: 'What is your name?'
    }
  ]).then(function(answer){
    game.userName = answer.userName;
    console.log('Good Luck '+game.userName+'!');
    // console.log(game.questionsArr);
    game.displayQACard();

  });

});
