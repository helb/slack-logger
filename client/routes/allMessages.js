FlowRouter.route("/", {
    name: "allMessages",
    action: function(params) {
        BlazeLayout.render("appLayout", {
            content: "messages"
        });
    }
});
