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

      for( i = 0 ; i < randomWord.length;i++){
        if (randomWord.includes(newGuess.guess)) {
          console.log('good guess')
        }else {
           guessLeft - 1;
         }

        if (randomWord[i] === newGuess.guess) {
          gameArray[i] = randomWord[i];
          console.log( randomWord[i] + ' is correct');
          console.log(userGuess);
          console.log(gameArray);
        }else {
          console.log('try again')
        }
      }

      if (gameArray.join("") === randomWord.join("")) {
        // response.send("YOU WIN!");
      }

      response.render('game', {
        userEntrey: userGuess,
        randomWord: gameArray
      });

      let count =  userGuess.length;
      console.log(guessLeft + "guesses");
      if (guessLeft === 0) {
        console.log('gameOver');
        // for (var i = 0; i < gameArray.length; i++) {
        //   if (gameArray[i] === " ") {
        //     // function(){
        //     //   let missedLetter = document.getElementbyId('correctLetter');
        //     //   missedLetter.getElementsByTagName("LI")[i].style.color = "red";
        //       gameArray[i] = randomWord[i];
        //     }
        //   }
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
