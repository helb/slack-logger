Template.channels.helpers({
	channels: function(){
		return Channels.find({}, {sort: {name: 1}});
	}
});
