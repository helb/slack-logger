Template.channels.onCreated(function() {
    var instance = this;

    instance.autorun(function() {
        var subscription = instance.subscribe("channels");

        if (subscription.ready()) {
            if (FlowRouter.getRouteName() === "channelDetail") {
                q(".channel-link[href$='" + FlowRouter.getParam("channelId") + "']").classList.add("active");
            }
        }
    });
});

Template.channels.helpers({
    channels: function() {
        return Channels.find({}, {
            sort: {
                name: 1
            }
        });
    }
});

Template.channels.events({
    "click .channel-link": function(event) {
        qa(".channel-link").forEach(function(link) {
            link.classList.remove("active");
        });
        event.target.classList.add("active");
    }
});
