Router.route("/c/:_id", function() {
    this.render("messages", {
        data: function() {
            Meteor.subscribe("channelMessages", this.params._id, Session.get("currentLimit") || 10);
            Session.set("searchScope", "channel");
            Session.set("searchScopeId", this.params._id);
            return {
                messages: Messages.find({
                    channel: this.params._id
                }, {
                    sort: {
                        created: 1
                    }
                })
            };
        }
    });
});
