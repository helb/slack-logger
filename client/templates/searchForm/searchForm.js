Template.searchForm.helpers({
    scopeId: function() {
        return FlowRouter.getParam("channelId") || FlowRouter.getParam("userId");
    },
    scopedRoute: function(name, target) {
        if (name === target) {
            return true;
        } else {
            if (name === "search" && target === Session.get("searchScope")) {
                return true;
            } else {
                return false;
            }
        }
    },
    routeName: function() {
        var searchScope = Session.get("searchScope");

        if (!searchScope) {
            return FlowRouter.getRouteName();
        } else {
            if (searchScope === "channel") {
                return "channelDetail";
            } else if (searchScope === "user") {
                return "userDetail";
            } else {
                return false;
            }
        }
    }
});

Template.searchForm.events({
    "submit .filter": function(event) {
        event.preventDefault();
        Session.set("searchValue", q("input.search").value);
        Session.set("searchType", q("input[name='search-type']:checked").value);
        if (q("input[name='search-scope']") !== null) {
            Session.set("searchScope", q("input[name='search-scope']:checked").value);
            Session.set("searchScopeId", q("input[name='search-scope']:checked").dataset.scopeid);
        }
        FlowRouter.go("/search");
    }
});
