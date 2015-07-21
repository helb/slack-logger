Router.route("/", function() {
	this.render("messages", {
		data: function() {
			Meteor.subscribe("allMessages");
			return {
				messages: Messages.find({}, {
					sort: {
						created: 1
					}
				})
			};
		}
	});
});
