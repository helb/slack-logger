Channels = new Meteor.Collection("channels");

Schemas.Channel = new SimpleSchema({
	name: {
		type: String,
		label: "Channel name"
	}
});

Channels.attachSchema(Schemas.Channel)