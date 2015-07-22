Template.filter.helpers({
    scopeId: function() {
        return Session.get("searchScopeId");
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
    }
});
