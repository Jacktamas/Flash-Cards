var card = function(question, answer, choices){
  this.back = question;
  this.front = answer;
  this.choices = choices;
}
card.prototype.addAnswer = function (answer) {
  return this.choices.push(answer);
};

module.exports = card;
