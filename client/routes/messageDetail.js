FlowRouter.route("/m/:messageId", {
    name: "messageDetail",
    action: function(params) {
        BlazeLayout.render("appLayout", {
            content: "messageDetail"
        });
    }
});
