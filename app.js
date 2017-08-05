const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");



var app = express();
var userGuess = [];
var gameArray = [];

let randomWord = words[Math.floor((Math.random() * 235000))
].split('');
randomWord.forEach(function(letter){
  gameArray.push(" ");

});



//sets a session

app.use(session({
  secret: "2C44-4D44-WppQ38S",
  resave: false,
  saveUninitialized:true,

}));

//configure mustache with express
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//Allows public folder to be served statically to browsers
app.use(express.static('public'));

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//config Express Validator
app.use(expressValidator());

app.get('/', function (request,response){
    response.render('game',{
      userEntrey: userGuess,
      randomWord: gameArray

  });
    console.log(randomWord);
    console.log(userGuess);
    console.log(gameArray);
  });


app.post('/', function(request, response) {
  var schema = {
    'userEntrey': {
      notEmpty: true,
      isLength: {
        options: {
          max: 1
        },
        errorMessage: 'One letter at a time'
      },
      errorMessage: 'Please enter a letter'
    }

  };
  console.log('received letter from form: ' + request.body.userEntrey);
  request.assert(schema);
  request.getValidationResult().then(function(results) {
    if (results.isEmpty()) {
      newGuess = {
        guess : request.body.userEntrey
      }
      console.log(newGuess.guess, "is the newGuess");
      userGuess.push(newGuess);
      console.log(userGuess);

      randomWord.forEach(function(letter){
        if (letter === newGuess.guess) {
          console.log('good guess')
        }else {
          console.log('try again')
        }
      });



      response.render('game', {
        userEntrey: userGuess,
        randomWord: gameArray


      });
      let count =  userGuess.length;
      let guessLeft = 8 - count;
      console.log(count + "guesses");
      console.log(guessLeft);
      if (guessLeft === 0) {
        console.log('gameOver');

      }

    } else {
      response.render('game', {
        userEntrey: userGuess,
        randomWord: gameArray,
        errorMessage: results.array()
      });
    }

  });



});


app.listen(3000, function(){
  console.log('Server farted');
});
