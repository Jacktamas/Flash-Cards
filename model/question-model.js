var questionObj = function(type, name, message, choicesArr){
  this.type = type;
  this.name = name;
  this.message = message;
  this.choices = choicesArr;
}

module.exports = questionObj;
