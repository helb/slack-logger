Router.route("/u/:_id", function() {
    this.render("messages", {
        data: function() {
            Meteor.subscribe("userMessages", this.params._id, Session.get("currentLimit") || 10);
            Session.set("searchScope", "user");
            Session.set("searchScopeId", this.params._id);
            return {
                messages: Messages.find({
                    author: this.params._id
                }, {
                    sort: {
                        created: 1
                    }
                })
            };
        }
    });
});
