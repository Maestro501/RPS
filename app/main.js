var mainApp = angular.module('mainApp', []);
var rootRef = new Firebase('https://sizzling-fire-704.firebaseio.com/');

var obj = { 'stats': [3, 1, 1, 1] };

var populate = function(obj){
  obj['rock'] = [ obj['stats'][1] / obj['stats'][0], { 'stats': [3, 1, 1, 1] } ];
  obj['scissors'] = [ obj['stats'][2] / obj['stats'][0], { 'stats': [3, 1, 1, 1] } ];
  obj['paper'] = [ obj['stats'][3] / obj['stats'][0], { 'stats': [3, 1, 1, 1] } ];
}

var firstPlay = true;

var attack = false;

populate(obj);

console.log(obj['rock']);

populate( obj['rock'][1] );
populate(obj['scissors'][1]);
populate(obj['paper'][1]);

rootRef.set(obj)

mainApp.controller('myController', function($scope){

  var hand = ['rock', 'scissors', 'paper'];

  var expectedHand;

  var expect = function(obj){
    var decider = Math.random()
    console.log(decider);
    console.log(obj);
    if( decider < obj['rock'] ){
      expectedHand = 'rock';
    }else if( decider < ( Number(obj['rock']) + Number(obj['scissors']) ) ){
      console.log('should be scissors')
      expectedHand = 'scissors';
    }else{
      console.log(obj['rock'] + obj['scissors'])
      expectedHand = 'paper';
    }
  }


  $scope.computerHand;

  $scope.playerHand;

  $scope.attacker = '';

  $scope.streak = 0;

  $scope.computer = function(){
      console.log(expectedHand);
      console.log(attack);
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