Router.route("/m/:_id", function() {
    this.render("messageDetail", {
        data: function() {
            Meteor.subscribe("oneMessage", this.params._id);
            delete Session.keys.searchScope;
            delete Session.keys.searchScopeId;
            return Messages.findOne({
                _id: this.params._id
            });
        }
    });
});