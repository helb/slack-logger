Template.registerHelper("formatDate", function(date) {
    return moment(date).format("D.M.YYYY HH:mm:ss");
});

Template.registerHelper("routeName", function() {
    var routePath = Router.current().route.getName();
    if(typeof routePath === "undefined"){
        return "root";
    } else if(/^m\.:*/.test(routePath)){
        return "message";
    } else if(/^u\.:*/.test(routePath)){
        return "user";
    } else if(/^c\.:*/.test(routePath)){
        return "channel";
    } else if(routePath === "search"){
        return "search";
    } else {
        return null;
    }
});
