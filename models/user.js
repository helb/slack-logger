slackUsers = new Meteor.Collection("slackusers");

Schemas.slackUser = new SimpleSchema({
    userName: {
        type: String,
        label: "User name"
    },
    realName: {
        type: String,
        label: "Real name",
        optional: true
    },
    avatarUrl: {
        type: String,
        label: "Avatar URL"
    }
});

slackUsers.attachSchema(Schemas.slackUser);
