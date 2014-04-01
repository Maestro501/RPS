var mainApp = angular.module('mainApp', []);
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
console.log(obj);
  var result = ['win', 'lose'];
  var hand = ['rock', 'scissors', 'paper'];

  for (var i = 0; i < result.length; i++) {
    for (var k = 0; k < hand.length; i++) {
      obj[ result[i] ][ hand[k] ] = [ obj ]
    };
  };

  obj['win']['rock'] = [ obj['win']['stats'][1] / obj['win']['stats'][0] ];
  obj['win']['scissors'] = [ obj['win']['stats'][2] / obj['win']['stats'][0] ];
  obj['win']['paper'] = [ obj['win']['stats'][3] / obj['win']['stats'][0] ];
  obj['lose']['rock'] = [ obj['lose']['stats'][1] / obj['lose']['stats'][0] ];
  obj['lose']['scissors'] = [ obj['lose']['stats'][2] / obj['lose']['stats'][0] ];
  obj['lose']['paper'] = [ obj['lose']['stats'][3] / obj['lose']['stats'][0] ];
  console.log(obj);
}

var firstPlay = true;

var attack = false;

populate(obj);


rootRef.set(obj)

mainApp.controller('myController', function($scope){

  var hand = ['rock', 'scissors', 'paper'];

  var expectedHand;

  var expect = function(obj){
    var decider = Math.random()
    if( decider < obj['rock'] ){
      expectedHand = 'rock';
    }else if( decider < ( Number(obj['rock']) + Number(obj['scissors']) ) ){
      expectedHand = 'scissors';
    }else{
      expectedHand = 'paper';
    }
  }


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

      if(player === 'rock'){
        obj['stats'][0]++;
        obj['stats'][1]++;
        populate(obj);
        rootRef.set(obj);
      }else if(player === 'scissors'){
        obj['stats'][0]++;
        obj['stats'][2]++;
        populate(obj);
        rootRef.set(obj);
      }else{
        obj['stats'][0]++;
        obj['stats'][3]++;
        populate(obj);
        rootRef.set(obj);
      }

      if( $scope.attacker === "computer's attack!" ){
        alert('YOU LOSE!');
        attack = false;
        firstPlay = true;
        $scope.streak = 0;
        $scope.playerHand = '';
        $scope.computerHand = '';
        $scope.attacker = '';
      }else if( $scope.attacker === "Your attack!" ){
        alert('YOU WIN!');
        attack = false;
        firstPlay = true;
        $scope.streak++;
        $scope.playerHand = '';
        $scope.computerHand = '';
        $scope.attacker = '';
      } else {
        $scope.attacker = 'draw!';
      }

    }else{
      if(player === 'rock'){
        obj['stats'][0]++;
        obj['stats'][1]++;
        populate(obj);
        rootRef.set(obj);

        if (computer === 'paper'){
          $scope.attacker = "computer's attack!";
          attack = true;
          firstPlay = false;
        }else{
          $scope.attacker = "Your attack!";
          attack = false;
          firstPlay = false;
        }

      }else if(player === 'scissors'){
        obj['stats'][0]++;
        obj['stats'][2]++;

        if ( computer === 'rock' ){
          $scope.attacker = "computer's attack!";
          attack = true;
          firstPlay = false;
        }else{
          $scope.attacker = "Your attack!";
          attack = false;
          firstPlay = false;
        }

      }else{
        obj['stats'][0]++;
        obj['stats'][2]++;

        if ( computer === 'scissors' ){
          $scope.attacker = "computer's attack!";
          attack = true;
          firstPlay = false;
        }else{
          $scope.attacker = "Your attack!";
          attack = false;
          firstPlay = false;
        }

      }
    }
  }

  $scope.player = function(n){
    expect(obj);
    $scope.computer();
    $scope.playerHand = hand[n];
  }
})