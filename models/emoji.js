Emojis = new Meteor.Collection("emojis");

Schemas.Emoji = new SimpleSchema({
    url: {
        type: String,
        label: "Image URL"
    }
});

Emojis.attachSchema(Schemas.Emoji)