var module = angular.module('presenceChannels', []);
module.controller('PresenceCtrl', [
  '$scope',
  '$interval',
  'presence',
  function($scope, $interval, presence){
    $scope.channels = {
      channelName : 'Channel-1'
    };

    $scope.channel = presence.subscribe($scope.channelName);

    $scope.randomize = presence.update;

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
      '<ul>',
      '<li ng-repeat="user in channel track by $index" ng-if="user !== currentUser">',
      '<img class="hover" ng-src="{{ user.imageUrl }}" width="30" height="30"  />',
      '<span class="text">{{ user.username }} ({{ user.name }})</span>',
      '</li>',
      '</ul>',
      '<button ng-click="subscribe( channel )">Subscribe</button>',
      '<button ng-click="unsubscribe( channel )">Unsubscribe</button>'
    ].join(''),
    controller: ['$scope', 'auth', 'presence', function($scope, auth, presence) {

      //pass current user onto scope
      $scope.currentUser = auth.currentUser;

      $scope.count = function(channel) {
        var counter = null;
        for(var i = 0; i < channel.length - 3; i++) {
            counter++;
        }
        return counter;
      };

      //update channel subscription
      $scope.updateChannel = function(channel){
        $scope.channel = channel;
        channel.push(auth.currentUser);
      };

      //calls current user to subscribe to channel
      $scope.subscribe = function(channel) {
        console.log(channel);
        $scope.channel = channel;
        channel.push(auth.currentUser);
        console.log('You have entered' + $scope.channel);
      };

      //calls current user to unsubscribe from channel
      $scope.unsubscribe = function(channel) {
        for(var i = 0; i < channel.length; i++) {
          if($scope.currentUser === channel[i]) {
            console.log(channel[i].username + ' has left');
            channel.splice(i,1);
          }
        }
      };
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