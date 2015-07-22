Users = new Meteor.Collection("users");

Schemas.User = new SimpleSchema({
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

Users.attachSchema(Schemas.User);
