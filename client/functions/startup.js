Meteor.startup(function() {
    Meteor.subscribe("channels");
    Meteor.subscribe("slackUsers");
});
