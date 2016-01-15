Presence channels
In FareHarbor we have a kind of object called an "availability", which represents a particular date and time that an activity can be booked. When you are viewing a book form (for instance,https://fareharbor.com/sailingcat/items/5/availability/3970422/book/) you are booking an availability. One feature we want to implement for our logged-in "company users" (employees of an activity provider) is a display of the users that are currently booking the availability too -- that way, if the reservationist next to you is booking as well, you can more easily coordinate so you don't have a situation in which you both want to book the same slots for different customers. In the future we'd even associate the number of "seats" each user is currently booking on a particular book form, so we can improve the experience further.

We plan to use websockets to allow users to "subscribe" to Pusher presence channels, one per "availability". When the user loads up the "availability", they will subscribe to the channel. When they leave the "availability" (by booking or by navigating elsewhere) they will unsubscribe. That way other users that are subscribed to the same channel can view all of the users that are in the channel.

For this project, you can assume the existence of a presence service that allows you to subscribe to arbitrary channels by name. We haven't built this yet, but it will be based on the Pusher Client Presence Channel API (https://pusher.com/docs/client_api_guide/client_presence_channels) and will roughly include the following methods:

presence.subscribe(channel_name): subscribe to the channel. Returns a list of user objects representing all users, including the current user, that are subscribed to the channel. For simplicity let's assume that the user objects have the following form:

{
  name: "Kelly User",
  username: "kelly",
  image_url: "https://somewhere.com/an-image.jpg"
}

The list of users returned can be watched via $watchCollection -- it will automatically be updated with new users as they subscribe and unsubscribe. We'll assume that the presence directive is responsible for rendering any errors in some out-of-band way -- for now we can assume that the list of users returned will always be the right list.

presence.unsubscribe(channel_name): unsubscribe from the channel, returns nothing.

The project here is to implement a directive, ng-presence, that takes as its argument a channel name and renders a list of small user images which, when you roll over them, show the users name and username ("Kelly User (kelly)" for instance). If more than some fixed small number of users are in the channel, we'll show a that number of users, plus the text "+ N more" for whatever number N. For instance, if you pick 3 as the fixed small number, and there are 5 in the channel, you'd see 3 user images followed by "+ 2 more". If you hover that text you get a comma separated list of users ("Kelly User (kelly) and Joe User (joe)", say). Assume that the list of users will contain "yourself" -- use the authservice, which exposes auth.currentUser, to ensure you don't render yourself. (Here's where, if we knew the number of seats being held, we could render it alongside the user, perhaps with a "total seats held" number).

Usage should look like this:

<div ng-presence="someObject.someChannelName"></div>
And should produce something that is somehow reminiscent of the thing you see in Google Docs all of the time:

Inline image 1

(We are only worried about the profile pictures, obviously).

When the ng-presence directive is added to the DOM, it should subscribe, and remain subscribed for the entirety of its life in the DOM, constantly showing updates to the channel. When it is removed from the DOM it should unsubscribe. So you should be able to drop a bunch of presence channels into the DOM, say via an ng-repeat, and they should all work correctly as they are added and removed (whether you are showing the same channel multiple times, or showing multiple different channels, or whatever). You could also add a way to observe a channel without actually subscribing to it, if you'd like -- you'll likely need to change the presence service's API, but that's fine.

Your focus should be on implementing the directive and any necessary templates, and ensuring that it works as expected. Next would be expanding on these simple guidelines to take this from the level of "hack" to the level of "feature" -- anything from a wish-list of enhancements to tested improvements. Styling is less important but also very fun, so go wild if you like!

See this plnkr for the implementations of mock presence and authservices. The presence mock includes a method update that just randomly updates channels with arbitrary users, for testing. It also includes a simple controller that renders a single channel in a pretty janky/ugly way, just to demonstrate in a very general way what we're going for.  Feel free to tweak the mocks to provide better / different signatures, as long as it seems reasonable that you'd actually be able to implement them one day!

Feel free to create you own repo that includes the implementation of ng-presence as well as, at least, a simple example page (or link to a plnkr of one) that shows your directive in action in a few different settings.

test
