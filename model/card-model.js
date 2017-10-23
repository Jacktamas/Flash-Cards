var card = function(question, answer, choices){
  this.back = question;
  this.front = answer;
  this.choices = choices;
}

card.prototype.showQuestion = function () {
  return this.back;
};
card.prototype.showAnswer = function () {
  return this.front;
};
card.prototype.addAnswer = function (answer) {
  return this.choices.push(answer);
};


module.exports = card;
