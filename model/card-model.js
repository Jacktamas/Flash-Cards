var card = function(question, answer){
  this.back = question;
  this.front = answer;
  this.choices = [];
}
card.prototype.addChoice = function (choice) {
  return this.choices.push(choice);
};

module.exports = card;
