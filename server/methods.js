Meteor.methods({
	logSlackEvent: function(slackEvent) {
		return Events.insert(slackEvent);
		// console.log(slackEvent);
	},
	addMessage: function(message) {
		return Messages.insert(message);
		// console.log(slackEvent);
	},
	removeMessage: function(id, key) {
		if(key == "rybu"){
			return Messages.remove({_id: id});
		} else {
			return "I need a key.";
		}
	}
});