Template.filter.events({
    "submit .filter": function(event) {
        event.preventDefault();
        Session.set("searchValue", q("input.search").value);
        Session.set("searchType", q("input[name='search-type']:checked").value);
        if(q("input[name='search-scope']") !== null) {
            Session.set("searchScope", q("input[name='search-scope']:checked").value);
            Session.set("searchScopeId", q("input[name='search-scope']:checked").dataset.scopeid);
        }
        Router.go("search");
    }
});
