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