const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');

const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


var app = express();

let randomWord = words[Math.floor((Math.random() * 235000))
].split('')
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
  if (! request.session) {
    response.redirect('/game');
  }else{
    response.render('game');
    console.log(randomWord);

  }


});

app.listen(3000, function(){
  console.log('Server farted');
});

// app.get('/', function (response, request){
//   if (request.session) {
//
//   }

// });
