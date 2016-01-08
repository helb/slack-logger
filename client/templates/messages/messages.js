Template.messages.onCreated(function() {
    var instance = this;

    instance.filter = new ReactiveVar({});
    instance.autoscroll = new ReactiveVar(true);

    instance.limit = new ReactiveVar(Meteor.settings.public.loadAtOnce, function(oldValue, newValue) {
        if (oldValue !== newValue) {
            instance.autoscroll.set(false);
            return false;
        } else {
            instance.autoscroll.set(true);
            return true;
        }
    });

    instance.channel = new ReactiveVar(FlowRouter.getParam("channelId"), function(oldValue, newValue) {
        if (oldValue !== newValue) {
            instance.limit.set(Meteor.settings.public.loadAtOnce);
            instance.autoscroll.set(true);
            return false;
        } else {
            return true;
        }
    });

    instance.user = new ReactiveVar(FlowRouter.getParam("userId"), function(oldValue, newValue) {
        if (oldValue !== newValue) {
            instance.limit.set(Meteor.settings.public.loadAtOnce);
            instance.autoscroll.set(true);
            return false;
        } else {
            return true;
        }
    });

    instance.autorun(function() {
        instance.user.set(FlowRouter.getParam("userId"));
        instance.channel.set(FlowRouter.getParam("channelId"));

        if (instance.user.get() !== undefined || instance.channel.get() !== undefined) {
            if (instance.user.get() !== undefined) {
                instance.filter.set({
                    author: instance.user.get()
                });
            }

            if (instance.channel.get() !== undefined) {
                instance.filter.set({
                    channel: instance.channel.get()
                });
            }
        } else {
            instance.filter.set({});
        }

        var subscription;

        if (FlowRouter.getRouteName() === "search") {
            instance.filter.set({});
            subscription = instance.subscribe("searchMessages", Session.get("searchValue"), Session.get("searchType"), Session.get("searchScope"), Session.get("searchScopeId"), instance.limit.get());
            if (q(".load-older")) {
                // q(".load-older").classList.add("hidden");
            }
        } else {
            delete Session.keys["searchScope"];
            subscription = instance.subscribe("messages", instance.filter.get(), instance.limit.get());
        }

        if (subscription.ready()) {
            if (instance.autoscroll.get()) {
                window.scrollTo(0,document.body.scrollHeight);
            }
            if (q(".load-older")) {
                q(".load-older").classList.remove("loading");
            }
        }
    });
});

Template.messages.helpers({
    messages: function() {
        var instance = Template.instance();
        return Messages.find(instance.filter.get(), {
            sort: {
                created: 1
            },
        });
    }
});

Template.messages.events({
    "click .message-header a": function() {
        qa(".channel-link").forEach(function(link) {
            link.classList.remove("active");
        });
    },

    "click .load-older": function(event, template) {
        event.target.classList.add("loading");
        template.limit.set(template.limit.get() + Meteor.settings.public.loadAtOnce);
    }
});
