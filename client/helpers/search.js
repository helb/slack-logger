Template.search.helpers({
    messages: function() {
        if (Session.get("searchScope")) {
            Meteor.subscribe("searchMessages", Session.get("searchValue"), Session.get("searchType"), Session.get("searchScope"), Session.get("searchScopeId"));
        } else {
            Meteor.subscribe("searchMessages", Session.get("searchValue"), Session.get("searchType"));
        }
        if (Session.get("searchValue")) {
            return Messages.find();
        } else {
            return null;
        }
    },
    formatMessage: function(text) {
        return slackFormat(text);
    }
});
