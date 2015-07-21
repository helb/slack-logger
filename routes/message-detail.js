Router.route("/m/:_id", function() {
	this.render("messageDetail", {
		data: function() {
			Meteor.subscribe("oneMessage", this.params._id);
			return Messages.findOne({
				_id: this.params._id
			});
		}
	});
});