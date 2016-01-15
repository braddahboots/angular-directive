var module = angular.module('presenceChannels', []);
module.controller('PresenceCtrl', [
  '$scope',
  '$interval',
  'presence',
  function($scope, $interval, presence){
    $scope.channel = presence.subscribe('channel-1');
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

// Presence mock.
module.factory('presence', [
  '$filter',
  '$http',
  'auth',
  function($filter, $http, auth){
    var capitalize = $filter('uppercase');
    var channels = {};
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
          console.log(randomUser);
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

//"availability" is an object specific to an activity and stores a date and time said activity can be booked.
//need to access a channelName object which should have the "availability" and logged-in "users"
//presence.subscribe(channel_name) subscribe user to channel
    //returns: users object (list of all subscribed users including current self/user)
//setup $watchCollection to automatically update with users as they sub and unsub to channel
//assume presence returns correct list of users each time
//presence.unsubscribe(channel_name) unsubscribe user from channel
    //returns: nothing

//SCOPE: create a ng-presence directive that:
  // - takes in a channel name as an argument
  // - renders a list of small user images
  // - when you scroll over images they show username and name
  // - if more than fixed amount of small users then should read "+ N more"
  // - should not renders current self (use authservice to $filter name out from render)

      // <div ng-presence="{{ someObject.someChannelName }}"></div>

  // - when ng-presence directive is added to DOM it should subscribe and remain for entirety of it's life

//need to collect the value of the current channel object (test example is channel-1)
//Channel object to have channel-1 as the key and an array of objects (users) as the values.
//Directive should be able to access via presence (service/factory) ex presence.subscribed(channel_name).
//template should repeat each user from channel with image / username / name
//set max visible images with a "+" X amount of additional users (array.length - max)
//establish css setting when image is hovered over that username and name are visible
//$filter | viewing current test user from basecase

//directive mock.
module.directive('ngPresence', function() {
  return {
    restrict: 'A',
    scope: {channelName: '=ngPresence'},
    template: [
      '<li ng-repeat="user in channel">',
      '<img ng-src="{{ user.imageUrl }}" width="25" height="25"  />',
      '<p style="visibility:hidden">"{{ user.username }}" "({{ user.username }})"</p>',
      '</li>'
    ].join(''),
    controller: ['$scope', 'presence', function($scope, presence) {
      console.log(presence);
      // this is just for simulation to test current directive
      $scope.subscribe = function(channelName) {
        $scope.channel = presence.subscribe(channelName);
      };
      $scope.unsubscribe = function(channelName) {
        $scope.channel = null;
        presence.unsubscribe(channelName);
      };
    }],
    link: function(scope, elem, attrs) {
      elem.bind('mouseover', function() {
        elem.css('visibility', 'visible');
      });
    }
  };
});