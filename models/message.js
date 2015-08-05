Messages = new Meteor.Collection("messages");

Schemas.Message = new SimpleSchema({
    content: {
        type: String,
        label: "Content"
    },
    author: {
        type: String,
        regEx: /^U[A-Z0-9]+$/,
        label: "Author"
    },
    channel: {
        type: String,
        regEx: /^C[A-Z0-9]+$/,
        label: "Parent channel"
    },
    type: {
        type: String,
        allowedValues: [
            "message",
            "bot_message",
            "me_message",
            "message_changed",
            "message_deleted",
            "channel_join",
            "channel_leave",
            "channel_topic",
            "channel_purpose",
            "channel_name",
            "channel_archive",
            "channel_unarchive",
            "group_join",
            "group_leave",
            "group_topic",
            "group_purpose",
            "group_name",
            "group_archive",
            "group_unarchive",
            "file_share",
            "file_comment",
            "file_mention",
            "pinned_item",
            "unpinned_item"
        ],
        label: "Message type"
    },
    created: {
        type: Date,
        label: "Creation date"
    }
});

Messages.attachSchema(Schemas.Message);

Messages.helpers({
    authorRef: function() {
        return Users.findOne(this.author);
    },
    channelRef: function() {
        return Channels.findOne(this.channel);
    }
});