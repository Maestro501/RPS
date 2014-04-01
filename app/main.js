var mainApp = angular.module('mainApp', []);

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
        if (computer === 'paper'){
          $scope.attacker = "computer's attack!";
        }else{
          $scope.attacker = "Your attack!";
        }
      }else if(player === 'scissors'){
        if ( computer === 'rock' ){
          $scope.attacker = "computer's attack!";
        }else{
          $scope.attacker = "Your attack!";
        }
      }else{
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