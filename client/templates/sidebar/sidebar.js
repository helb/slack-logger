Template.sidebar.events({
    "click .logo": function() {
        qa(".channel-link").forEach(function(link) {
            link.classList.remove("active");
        });
    }
});

Template.sidebar.helpers({
    teamName: function() {
        return Meteor.settings.public.teamName;
    }
})
