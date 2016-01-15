var module = angular.module('presenceChannels', []);
module.controller('PresenceCtrl', [
  '$scope',
  '$interval',
  'presence',
  function($scope, $interval, presence){
    $scope.channel = presence.subscribe('channel-1');
    $scope.randomize = presence.update;

    // this is just for simulation to test current directive
    $scope.subscribe = function(channelName) {
      $scope.channel = presence.subscribe(channelName);
    };
    $scope.unsubscribe = function(channelName) {
      $scope.channel = null;
      presence.unsubscribe(channelName);
    };
    $interval(function(){
      $scope.randomize();
    }, 2500);
  }
]);

// Auth mock.
module.factory('auth', [
  function(){
    return {
      currentUser: {
        name: 'Kelly User',
        username: 'kelly',
        imageUrl: "http://api.randomuser.me/portraits/med/women/39.jpg"
      }
    };
  }
]);

//directive mock
module.directive('ngPresence', function() {
  return {
    restrict: 'A',
    scope: {channel: '=ngPresence'},
    template: [
      '<li ng-repeat="user in channel">',
      '<div class="img">',
      '<img class="hover" ng-src="{{ user.imageUrl }}" width="30" height="30"  />',
      '<span class="text">{{ user.username }}({{ user.username }})</span>',
      '</div>',
      '</li>'
    ].join(''),
    controller: ['$scope', 'auth', function($scope, auth) {
      $scope.currentUser = auth.currentUser;
    }],
  };
});

// Presence mock.
module.factory('presence', [
  '$filter',
  '$http',
  'auth',
  function($filter, $http, auth){
    var capitalize = $filter('uppercase');
    var channels = {};
    console.log('channels', channels);
    return {
      // Subscribe to the channel.
      subscribe: function(channelName){
        var channel = channels[channelName];
        if(!channel){
          channel = channels[channelName] = [];
        }
        channel.push(auth.currentUser);
        return channel;
      },

      // Unsubscribe from the channel.
      unsubscribe: function(channelName){
        delete channels[channelName];
      },

      // Adds or removes a random user to all current channels, for testing.
      update: function(){
        $http({
          method: 'GET',
          url: 'https://randomuser.me/api'
        }).then(function(response){
          var randomUser = response.data.results[0].user;
          console.log('random', randomUser);
          var user = {
            name: capitalize(randomUser.name.first) + ' ' + capitalize(randomUser.name.last),
            username: randomUser.username,
            imageUrl: randomUser.picture.medium
          };

          _.forEach(channels, function(channel, channelName){
            if(Math.random() < 0.75){
              channel.push(user);
            }
            else if(channel.length > 1){
              channel.pop();
            }
          });
        });
      }
    };
  }
]);
