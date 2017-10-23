var DeckModel = require('../model/deck-model.js');
var CardModel = require('../model/card-model.js');
var QuestionModel = require('../model/question-model.js');

var request = require('request');
var inquirer = require('inquirer');
var url = 'https://opentdb.com/api.php?amount=6&difficulty=easy&type=multiple&category=';

var game = {
  cardsDeck: new DeckModel(),
  userName: null,
  correctAnswers: [],
  userCorrect: 0,
  userIncorrect: 0,
  questionsArr: [],
  replay: false,
  startGame: function(){
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
      if(game.userName === null){
        inquirer.prompt([
          {
            type: 'input',
            name: 'userName',
            message: 'What is your name?'
          }
        ]).then(function(answer){
          game.userName = answer.userName;
          console.log('\n GOOD LUCK!! '+game.userName.toUpperCase()+'!\n');
          // console.log(game.questionsArr);
          game.displayQACard();
        });
      }
      else {
        game.displayQACard();
      }
    });
  },


  //Get Questions and answers from opentdb API
  gameInit: function(url,category){
    if(game.replay === false){
      game.userCorrect = 0;
      game.userIncorrect = 0;
    }
    request(url+category, this.getQA);
  },

  shuffle: function (deckArr) {
    var j, x, i;
    for (i = deckArr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = deckArr[i];
      deckArr[i] = deckArr[j];
      deckArr[j] = x;
    }
    return deckArr;
  },

  displayQACard: function(){
    this.shuffle(game.cardsDeck);
    inquirer.prompt(game.questionsArr).then(function(answers){
      for(var key in answers){
        if(game.correctAnswers.indexOf(answers[key]) !== -1){
          game.userCorrect +=1;
        }
        else if(game.correctAnswers.indexOf(answers[key]) === -1) {
          game.userIncorrect +=1;
        }
      }
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'playAgain',
          message: 'Would you like to play again?'
        }
      ]).then(function(confirmation){
        if(confirmation.playAgain === true){
          game.replay = true;
          game.startGame();
        }
        else {
          game.endGame()
        }
      });
    });
  },
  endGame: function() {
    game.replay = false;
    console.log('\n '+game.userName,'you have '+game.userCorrect+' correct answers & '+game.userIncorrect+' incorrect answers! Good Job!');
  },
  // Build Cards and Deck
  getQA: function(error, reponse, body) {
    if(error){
      throw error;
    }
    for(var i=0; i < JSON.parse(body).results.length; i++){
      game.cardsDeck.addCard(new CardModel(JSON.parse(body).results[i].question, JSON.parse(body).results[i].correct_answer, JSON.parse(body).results[i].incorrect_answers));
      game.cardsDeck.cards[i].addAnswer(JSON.parse(body).results[i].correct_answer);
      game.correctAnswers.push(JSON.parse(body).results[i].correct_answer);
      game.shuffle(game.cardsDeck.cards[i].choices);
      game.questionsArr.push(new QuestionModel('list', 'question'+i+'', game.cardsDeck.cards[i].back, game.cardsDeck.cards[i].choices));
    }
  }
}
module.exports = game;
