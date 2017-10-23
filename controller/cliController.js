var DeckModel = require('../model/deck-model.js');
var CardModel = require('../model/card-model.js');
var QuestionModel = require('../model/question-model.js');

var request = require('request');
var inquirer = require('inquirer');



var game = {
  startGame: true,
  endGame: false,
  cardsDeck: new DeckModel(),
  userName: null,
  correctAnswers: [],
  userCorrect: 0,
  userIncorrect: 0,
  questionsArr: [],

  //Get Questions and answers from opentdb API
  gameInit: function(url,category){
    game.userCorrect = 0;
    game.userIncorrect = 0;
    if(this.startGame === true){
      request(url+category, this.getQA);
    }
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
      game.validateAnswers(answers);
    });

  },
  validateAnswers: function(answersObj) {
    console.log(answersObj.length)
    for(var key in answersObj){
      

    }
    console.log(game.userName,'you have '+game.userCorrect+' correct answers & '+game.userIncorrect+' incorrect answers! Good Job!');
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
      game.questionsArr.push({
        type: 'confirm',
        name: 'endGame'+i+'',
        message: 'Would you like more questions?'
      });
    }
  },

  gameEnd: function (){
    if(this.endGame === true){
      this.startGame = false;
    }
  }
}
module.exports = game;
