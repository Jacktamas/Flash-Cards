var DeckModel = require('../model/deck-model.js');
var CardModel = require('../model/card-model.js');
var QuestionModel = require('../model/question-model.js');
var he = require('he')
var request = require('request');
var inquirer = require('inquirer');
var url = 'https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple&category=';

var game = {
  cardsDeck: new DeckModel(),
  userName: null,
  categories: ['General Knowledge', 'Film', 'Music', 'Science & Nature', 'Science: Computers'],
  selectedCategories: [],
  correctAnswers: [],
  userCorrect: 0,
  userIncorrect: 0,
  questionsArr: [],
  replay: false,
  //Start the game with inquirer prompt
  startGame: function(){
    for(var i=0; i < game.categories.length; i++){
      if(game.selectedCategories.indexOf(game.categories[i]) !== -1){
        game.categories.splice([i], 1);
      }
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'category',
        message: 'Choose your questions category:',
        choices: game.categories
      }
    ]).then(function(answer){
      game.selectedCategories.push(answer.category);
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
          game.displayQACard();
        });
      }
      else {
        game.displayQACard();
      }
    });
  },

  //Start the Game with Get Questions and answers from opentdb API
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
  //Decode string Characters from HTML Symboles to text
  decodeStr: function(string){
    if(string.length >= 20 ){
      string = he.decode(string, {
        'isAttributeValue': false
      }).toUpperCase();
    }
    else if(string.length < 20){
      string = he.decode(string, {
        'isAttributeValue': false
      });
    }
    return string;
  },

  //Display cards to user
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
      if (game.categories.length === 1) {
        game.endGame(answers)
      }
      else {
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
            game.endGame(answers)
          }
        });
      }
    });
  },
  //Ending the game and show the user guesses
  endGame: function(answers) {
    for(var i=0; i < game.correctAnswers.length; i++){
      console.log(' Your answer:', answers['question'+i+''], '==> Correct answer:', game.correctAnswers[i])
    }
    game.replay = false;
    if(game.userCorrect >= game.userIncorrect){
      console.log('\n '+(game.userName).toUpperCase()+',' ,'you have '+game.userCorrect+' correct answers & '+game.userIncorrect+' incorrect answers! Good Job!');
    }
    else {
      console.log('\n '+(game.userName).toUpperCase()+',' ,'you have '+game.userCorrect+' correct answers & '+game.userIncorrect+' incorrect answers! Stop watching TV! You need to go to college buddy!');
    }
  },
  // Build Cards and Decks
  getQA: function(error, reponse, body) {
    if(error){
      throw error;
    }
    for(var i=0; i < JSON.parse(body).results.length; i++){
      game.cardsDeck.addCard(new CardModel(
        game.decodeStr(JSON.parse(body).results[i].question),
        game.decodeStr(JSON.parse(body).results[i].correct_answer)
      ));
      var incorrectAnsArr = JSON.parse(body).results[i].incorrect_answers;
      for(var j=0; j < incorrectAnsArr.length; j++){
        game.cardsDeck.cards[i].addChoice(game.decodeStr(incorrectAnsArr[j]));
      }

      game.cardsDeck.cards[i].addChoice(game.decodeStr(JSON.parse(body).results[i].correct_answer));
      game.correctAnswers.push(game.decodeStr(JSON.parse(body).results[i].correct_answer));
      game.shuffle(game.cardsDeck.cards[i].choices);
      game.questionsArr.push(new QuestionModel('list', 'question'+i+'', game.cardsDeck.cards[i].back, game.cardsDeck.cards[i].choices));
    }
  }
}
module.exports = game;
