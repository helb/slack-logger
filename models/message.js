Messages = new Meteor.Collection("messages");

Schemas.Message = new SimpleSchema({
    content: {
        type: String,
        label: "Content"
    },
    author: {
        type: String,
        label: "Author"
    },
    channel: {
        type: String,
        label: "Parent channel"
    },
    created: {
        type: Date,
        label: "Creation date"
    }
});

Messages.attachSchema(Schemas.Message)

Messages.helpers({
    authorRef: function() {
        return Users.findOne(this.author);
    },
    channelRef: function() {
        return Channels.findOne(this.channel);
    },
});