Messages = new Meteor.Collection("messages");

Schemas.Message = new SimpleSchema({
    "_id": {
        "type": String,
        "regEx": /^U[A-Z0-9]{8}-C[A-Z0-9]{8}-[0-9]{10}\.[0-9]{6}$/,
        "label": "ID"
    },
    "content": {
        "type": String,
        "label": "Content"
    },
    "author": {
        "type": String,
        "regEx": /^U[A-Z0-9]+$/,
        "label": "Author"
    },
    "channel": {
        "type": String,
        "regEx": /^C[A-Z0-9]+$/,
        "label": "Parent channel"
    },
    "type": {
        "type": String,
        "label": "Message type"
    },
    "created": {
        "type": Date,
        "label": "Creation date"
    }
});

Messages.attachSchema(Schemas.Message);

Messages.helpers({
    authorRef: function() {
        return slackUsers.findOne(this.author);
    },
    channelRef: function() {
        return Channels.findOne(this.channel);
    }
});
