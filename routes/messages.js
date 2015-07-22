Router.route("/", function() {
    this.render("messages", {
        data: function() {
            Meteor.subscribe("allMessages", Session.get("currentLimit") || 10);
            delete Session.keys.searchScope;
            delete Session.keys.searchScopeId;
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