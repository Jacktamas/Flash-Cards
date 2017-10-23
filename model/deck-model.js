var Deck = function(){
  this.cards = [];
};

Deck.prototype.addCard = function (card) {
  this.cards.push(card);
};

module.exports = Deck;
