FlowRouter.route("/search", {
    name: "search",
    action: function(params) {
        BlazeLayout.render("appLayout", {
            content: "messages"
        });
    }
});
