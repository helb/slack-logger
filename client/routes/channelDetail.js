FlowRouter.route("/c/:channelId", {
    name: "channelDetail",
    action: function(params) {
        BlazeLayout.render("appLayout", {
            content: "messages"
        });
    }
});
