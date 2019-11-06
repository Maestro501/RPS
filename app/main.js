var mainApp = angular.module('mainApp', []);
var rootRef = new Firebase('https://sizzling-fire-704.firebaseio.com/');

var stats = {
  'player': 0,
  'computer': 0,
  'prediction': 0,
  'total': 0
};

rootRef.set(stats);




var playerData = ['player'];
var computerData = ['computer'];
//var predictionData = ['prediction'];

var data;

var updateData = function(stats, playerData, computerData, chart){
  playerData.push(stats['player']);
  computerData.push(stats['computer']);
  //predictionData.push(stats['prediction']);
  data = [
    playerData,
    computerData
    //predictionData
  ];
  chart.load({
    'columns':[
      playerData,
      computerData
     // predictionData
    ]
  });
};

var chart = c3.generate({
  bindto: '#chart',
  data: {
    columns: [
      playerData,
      computerData
      //predictionData
    ]
  }
});

var refreshData = function(obj){
  if( obj['win']['stats'][0] > 30 ){
    obj['win']['stats'][0] = 15;
    obj['win']['stats'][1] = obj['win']['rock'] * 15;
    obj['win']['stats'][2] = obj['win']['scissors'] * 15;
    obj['win']['stats'][3] = obj['win']['paper'] * 15;
  }else if( obj['lose']['stats'][0] > 30 ){
    obj['lose']['stats'][0] = 15;
    obj['lose']['stats'][1] = obj['lose']['rock'] * 15;
    obj['lose']['stats'][2] = obj['lose']['scissors'] * 15;
    obj['lose']['stats'][3] = obj['lose']['paper'] * 15;
  }
};



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

rootRef.push(obj);


mainApp.controller('mainController', function($scope){

  $scope.idiot = false;

  $scope.computerRock = false;
  $scope.computerScissors = false;
  $scope.computerPaper = false;

  // $scope.$route = $route;
  // $scopee.$location = $location;
  // $scope.routeParams = $routeParams;

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
    console.log(expectedHand);
  };

  $scope.accuracy = 0;

  $scope.computerHand;

  $scope.playerHand;

  $scope.attacker = '';

  $scope.streak = 0;

  $scope.stats;

  $scope.paper = function(n){
    for (var i = 0; i < n; i++) {
      $scope.player(2);
      $scope.match($scope.playerHand, $scope.computerHand);
    };
  };

  $scope.computer = function(){
    if(attack){
      if( expectedHand === 'rock' ){
        $scope.computerHand = 'rock';
        $scope.computerScissors = false;
        $scope.computerPaper = false;
        $scope.computerRock = true;

      }else if( expectedHand === 'scissors' ){
        $scope.computerHand = 'scissors';
        $scope.computerPaper = false;
        $scope.computerRock = false;
        $scope.computerScissors = true;
      }else{
        $scope.computerHand = 'paper';
        $scope.computerRock = false;
        $scope.computerScissors = false;
        $scope.computerPaper = true;
      }
    }else{
      if( expectedHand === 'rock' ){
        $scope.computerHand = 'paper';
        $scope.computerRock = false;
        $scope.computerScissors = false;
        $scope.computerPaper = true;
      }else if( expectedHand === 'scissors' ){
        $scope.computerHand = 'rock';
        $scope.computerScissors = false;
        $scope.computerPaper = false;
        $scope.computerRock = true;

      }else{
        $scope.computerHand = 'scissors';
        $scope.computerRock = false;
        $scope.computerPaper = false;
        $scope.computerScissors = true;
      }
    }
  };

  $scope.match = function(player, computer){
    if(player === computer){
      if(!previous){

        if(player === 'rock'){
          obj['win']['stats'][0]++;
          obj['win']['stats'][1]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }else if(player === 'scissors'){
          obj['win']['stats'][0]++;
          obj['win']['stats'][2]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }else{
          obj['win']['stats'][0]++;
          obj['win']['stats'][3]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }

      }else{

        if(player === 'rock'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][1]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }else if(player === 'scissors'){
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][2]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }else{
          obj['lose']['stats'][0]++;
          obj['lose']['stats'][3]++;
          refreshData(obj);
          populate(obj);
          rootRef.set(obj);
        }
      }

      if( $scope.attacker === "computer's attack!" ){
        $scope.attacker = "YOU LOST!";
        if( ( stats.computer - stats.player ) > 5 ){
          $scope.computerPaper = false;
          $scope.computerRock = false;
          $scope.computerScissors = false;
          $scope.idiot = true;
        }
        stats.computer++;
        $scope.stats = 'Player ' + stats.player + ' vs ' + stats.computer + ' Computer';
        rootRef.push(stats);
        updateData(stats, playerData, computerData, chart);
        attack = false;
        firstPlay = true;
        previous = false;
        $scope.streak = 0;
      }else if( $scope.attacker === "Your attack!" ){
        $scope.attacker = "YOU WON!"
        stats.player++;
        $scope.stats = 'Player ' + stats.player + ' vs ' + stats.computer + ' Computer';
        rootRef.push(stats);
        updateData(stats, playerData, computerData, chart);
        attack = false;
        firstPlay = true;
        previous = false;
        $scope.streak++;
      } else {
        $scope.attacker = 'draw!';
        previous = false;
      }

    }else{           //not a draw

      if(!previous){
        if(player === 'rock'){
        obj['win']['stats'][0]++;
        obj['win']['stats'][1]++;
        refreshData(obj);
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
          refreshData(obj);

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
          obj['win']['stats'][3]++;
          refreshData(obj);

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
          refreshData(obj);
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
          refreshData(obj);

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
          obj['lose']['stats'][3]++;
          refreshData(obj);

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
    stats['total']++;
    if( expectedHand === $scope.playerHand ){
      stats['prediction']++;
      $scope.accuracy = Math.ceil( stats['prediction'] / stats['total'] * 10000 ) / 100 + '%';
    }
  };
});

mainApp.controller('LoginController', function($scope){
  $scope.name = 'LoginController';
  $scope.params = $routeParams;
});


mainApp.controller('SignupController', function($scope, $routeParams){
  $scope.name = 'SignupController';
  $scope.params = $routeParams;
})

mainApp.controller('RankingController', function($scope, $routeParams){
  $scope.name = 'RankingController';
  $scope.params = $routeParams;
})


// mainApp.config((function($routeProvider, $locationProvider) {
//   $routeProvider
//    .when('/Index', {
//     templateUrl: 'index.html',
//     controller: 'mainController',
//     resolve: {
//       // I will cause a 1 second delay
//       delay: function($q, $timeout) {
//         var delay = $q.defer();
//         $timeout(delay.resolve, 1000);
//         return delay.promise;
//       }
//     }
//   })
//   .when('/Book/:bookId/ch/:chapterId', {
//     templateUrl: 'chapter.html',
//     controller: 'ChapterController'
//   });
//   // configure html5 to get links working on jsfiddle
//   $locationProvider.html5Mode(true);
// }));
