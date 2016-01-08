FlowRouter.route("/u/:userId", {
    name: "userDetail",
    action: function(params) {
        BlazeLayout.render("appLayout", {
            content: "messages"
        });
    }
});
