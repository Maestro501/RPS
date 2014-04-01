var mainApp = angular.module('mainApp', ['ngRoute']);
var rootRef = new Firebase('https://sizzling-fire-704.firebaseio.com/');

var obj = {
  'win': {
    'stats': [3, 1, 1, 1]
  },
  'lose': {
    'stats': [3, 1, 1, 1]
  }
};


var populate = function(obj){

  // var result = ['win', 'lose'];
  // var hand = ['rock', 'scissors', 'paper'];

  // for (var i = 0; i < result.length; i++) {
  //   for (var k = 0; k < hand.length; i++) {
  //     obj[ result[i] ][ hand[k] ] = [ obj ]
  //   };
  // };

  obj['win']['rock'] = [ obj['win']['stats'][1] / obj['win']['stats'][0] ];
  obj['win']['scissors'] = [ obj['win']['stats'][2] / obj['win']['stats'][0] ];
  obj['win']['paper'] = [ obj['win']['stats'][3] / obj['win']['stats'][0] ];
  obj['lose']['rock'] = [ obj['lose']['stats'][1] / obj['lose']['stats'][0] ];
  obj['lose']['scissors'] = [ obj['lose']['stats'][2] / obj['lose']['stats'][0] ];
  obj['lose']['paper'] = [ obj['lose']['stats'][3] / obj['lose']['stats'][0] ];
};

var previous = false;

var firstPlay = true;

var attack = false;

populate(obj);

rootRef.set(obj);

mainApp.controller('mainController', function($scope, $route, $routeParams, $location){
  
  $scope.$route = $route;
  $scopee.$location = $location;
  $scope.routeParams = $routeParams;

  var hand = ['rock', 'scissors', 'paper'];

  var expectedHand;

  var expect = function(obj){
    var decider = Math.random()
    if(!previous){
      if( decider < obj['win']['rock'] ){
        expectedHand = 'rock';
      }else if( decider < ( Number(obj['win']['rock']) + Number(obj['win']['scissors']) ) ){
        expectedHand = 'scissors';
      }else{
        expectedHand = 'paper';
      }
    }else{
      if( decider < obj['lose']['rock'] ){
        expectedHand = 'rock';
      }else if( decider < ( Number(obj['lose']['rock']) + Number(obj['lose']['scissors']) ) ){
        expectedHand = 'scissors';
      }else{
        expectedHand = 'paper';
      }
    }
  };


  $scope.computerHand;

  $scope.playerHand;

  $scope.attacker = '';

  $scope.streak = 0;

  $scope.computer = function(){
    if(attack){
      if( expectedHand === 'rock' ){
        $scope.computerHand = 'rock';
      }else if( expectedHand === 'scissors' ){
        $scope.computerHand = 'scissors';
      }else{
        $scope.computerHand = 'paper';
      }
    }else{
      if( expectedHand === 'rock' ){
        $scope.computerHand = 'paper';
      }else if( expectedHand === 'scissors' ){
        $scope.computerHand = 'rock';
      }else{
        $scope.computerHand = 'scissors';
      }
    }
  };

  $scope.match = function(player, computer){
    if(player === computer){
      if(!previous){

        if(player === 'rock'){
          obj['win']['stats'][0]++;
          obj['win']['stats'][1]++;
          populate(obj);
          rootRef.set(obj);
        }else if(player === 'scissors'){
          obj['win']['stats'][0]++;
          obj['win']['stats'][2]++;
          populate(obj);
          rootRef.set(obj);
        }else{
          obj['win']['stats'][0]++;
          obj['win']['stats'][3]++;
          populate(obj);
          rootRef.set(obj);
        }

      }else{

        if(player === 'rock'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][1]++;
          populate(obj);
          rootRef.set(obj);
        }else if(player === 'scissors'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][2]++;
          populate(obj);
          rootRef.set(obj);
        }else{
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][3]++;
          populate(obj);
          rootRef.set(obj);
        }

      }

      if( $scope.attacker === "computer's attack!" ){
        alert('YOU LOSE!');
        attack = false;
        firstPlay = true;
        previous = false;
        $scope.streak = 0;
        $scope.playerHand = '';
        $scope.computerHand = '';
        $scope.attacker = '';
      }else if( $scope.attacker === "Your attack!" ){
        alert('YOU WIN!');
        attack = false;
        firstPlay = true;
        previous = false;
        $scope.streak++;
        $scope.playerHand = '';
        $scope.computerHand = '';
        $scope.attacker = '';
      } else {
        $scope.attacker = 'draw!';
        previous = false;
      }

    }else{           //not a draw

      if(!previous){
        if(player === 'rock'){
        obj['win']['stats'][0]++;
        obj['win']['stats'][1]++;
        populate(obj);
        rootRef.set(obj);

        if (computer === 'paper'){
          $scope.attacker = "computer's attack!";
          previous = true;
          attack = true;
          firstPlay = false;
        }else{
          $scope.attacker = "Your attack!";
          previous = false;
          attack = false;
          firstPlay = false;
        }

        }else if(player === 'scissors'){
          obj['win']['stats'][0]++;
          obj['win']['stats'][2]++;

          if ( computer === 'rock' ){
            $scope.attacker = "computer's attack!";
            previous = true;
            attack = true;
            firstPlay = false;
          }else{
            $scope.attacker = "Your attack!";
            previous = false;
            attack = false;
            firstPlay = false;
          }

        }else{
          obj['win']['stats'][0]++;
          obj['win']['stats'][2]++;

          if ( computer === 'scissors' ){
            $scope.attacker = "computer's attack!";
            previous = true;
            attack = true;
            firstPlay = false;
          }else{
            $scope.attacker = "Your attack!";
            attack = false;
            previous = false;
            firstPlay = false;
          }

        }
      }else{
        if(player === 'rock'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][1]++;
          populate(obj);
          rootRef.set(obj);

          if(computer === 'paper'){
            $scope.attacker = "computer's attack!";
            attack = true;
            previous = true;
            firstPlay = false;
          }else{
            $scope.attacker = "Your attack!";
            previous = false;
            attack = false;
            firstPlay = false;
          }

        }else if(player === 'scissors'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][2]++;

          if ( computer === 'rock' ){
            $scope.attacker = "computer's attack!";
            previous = true;
            attack = true;
            firstPlay = false;
          }else{
            $scope.attacker = "Your attack!";
            previous = false;
            attack = false;
            firstPlay = false;
          }

        }else{
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][2]++;

          if ( computer === 'scissors' ){
            $scope.attacker = "computer's attack!";
            previous = true;
            attack = true;
            firstPlay = false;
          }else{
            $scope.attacker = "Your attack!";
            previous = false;
            attack = false;
            firstPlay = false;
          }
        }
      }
    }
  }

  $scope.player = function(n){
    expect(obj);
    $scope.computer();
    $scope.playerHand = hand[n];
  };
});

mainApp.controller('LoginController', function($scope, $routeParams){
  $scope.name = 'LoginController'
})


