Template.messageDetail.onCreated(function() {
    var instance = this;

    instance.autorun(function() {
        var messageId = FlowRouter.getParam("messageId");
        var subscription = instance.subscribe("oneMessage", messageId);
    });
});

Template.messageDetail.helpers({
    message: function() {
        return Messages.findOne({
            _id: FlowRouter.getParam("messageId")
        }, {
            sort: {
                created: 1
            },
        });
    }
});
