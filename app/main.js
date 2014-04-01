var mainApp = angular.module('mainApp', []);
var rootRef = new Firebase('https://sizzling-fire-704.firebaseio.com/');

var obj = {};
obj['stats'] = [3, 1, 1, 1];

var populate = function(obj){
  obj['rock'] = [ obj['stats'][1] / obj['stats'][0] ];
  obj['scissors'] = [ obj['stats'][2] / obj['stats'][0] ];
  obj['paper'] = [ obj['stats'][3] / obj['stats'][0] ];
}

populate(obj);

rootRef.push(obj)

mainApp.controller('myController', function($scope){

  var hand = ['rock', 'scissors', 'paper'];

  var chooseHand = function(hand){
    return hand[Math.floor(Math.random() * 3)];
  }

  $scope.computerHand;

  $scope.playerHand;

  $scope.attacker = '';

  $scope.streak = 0;

  $scope.computer = function(){
    $scope.computerHand = chooseHand(hand);
  };

  $scope.match = function(player, computer){

    if(player === computer){
      if( $scope.attacker === "computer's attack!" ){
        alert('YOU LOSE!');
        console.log($scope.computerHand);
        $scope.streak = 0;
        $scope.playerHand = '';
        $scope.computerHand = '';
        $scope.attacker = '';
      }else if( $scope.attacker === "Your attack!" ){
        alert('YOU WIN!');
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
        }else{
          $scope.attacker = "Your attack!";
        }
      }else if(player === 'scissors'){
        obj['stats'][0]++;
        obj['stats'][2]++;
        if ( computer === 'rock' ){
          $scope.attacker = "computer's attack!";
        }else{
          $scope.attacker = "Your attack!";
        }
      }else{
        obj['stats'][0]++;
        obj['stats'][2]++;
        if ( computer === 'scissors' ){
          $scope.attacker = "computer's attack!";
        }else{
          $scope.attacker = "Your attack!";
        }
      }
    }
  }

  $scope.player = function(n){
    $scope.computer();
    $scope.playerHand = hand[n];
  }
})