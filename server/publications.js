Meteor.publish("allMessages", function() {
	return Messages.find();
});

Meteor.publish("oneMessage", function(id) {
	return Messages.find({
		_id: id
	});
});

Meteor.publish("channelMessages", function(id) {
	return Messages.find({
		channel: id
	});
});

Meteor.publish("userMessages", function(id) {
	return Messages.find({
		author: id
	});
});

Meteor.publish("channels", function() {
	return Channels.find();
});

Meteor.publish("users", function() {
	return Users.find();
});

Meteor.publish("events", function() {
	return Events.find();
});


Meteor.publish("emoji", function(id) {
	return Emojis.find({
		_id: id
	});
});