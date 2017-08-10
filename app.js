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
let guessLeft = 8;
var result = "";


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
    randomWord: gameArray,
    guessLeft:guessLeft
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
      newGuess =  request.body.userEntrey

      console.log(newGuess, "is the newGuess");

      if (userGuess.includes(newGuess)) {
        errorMessage:'You used that already!';
        guessLeft = guessLeft + 1;
        response.render('game',
          {errorMessage: 'You used that letter already!',
          userGuess: userGuess,
          randomWord: gameArray,
          guessLeft:guessLeft});
      }else {
        userGuess.push(newGuess);
      }

      if (randomWord.includes(newGuess)) {
        console.log('good guess')
      }else {
         guessLeft= guessLeft - 1;
         console.log('you have '+ guessLeft+ 'guesses left');
         if (guessLeft === 0) {
           for (var i = 0; i < gameArray.length; i++) {
             if (gameArray[i] === " ") {
               gameArray[i] = randomWord[i];

                console.log(gameArray[i], 'MISSED');
               }
             }
             response.render('game', {result: 'You Lose',
              userGuess: userGuess,
             randomWord: gameArray,
             guessLeft:guessLeft,

           });
         }
       }

      for( i = 0 ; i < randomWord.length;i++){
        if (randomWord[i] === newGuess) {
          gameArray[i] = randomWord[i];
          console.log( randomWord[i] + ' is correct');
          console.log(userGuess,'are your past guesses too');
          console.log(gameArray);
        }else {
          console.log('try again')
        }
      }

      if (gameArray.join("") === randomWord.join("")) {
         response.render('game', {result: 'You Win',
         userGuess: userGuess,
         randomWord: gameArray,
         guessLeft:guessLeft,
       });
      }

      response.render('game', {
        userGuess: userGuess,
        randomWord: gameArray,
        guessLeft:guessLeft
      });

    } else {
      console.log(results.array());
      response.render('game',{

        userGuess: userGuess,
        randomWord: gameArray,
        guessLeft:guessLeft,
        errorMessage:results.array()

      });
    }
  });
});



app.listen(3000, function(){
  console.log('Server farted');
});
