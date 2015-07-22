Template.messages.events({
    "click .message-header a": function() {
        qa(".channel-link").forEach(function(link){
            link.classList.remove("active");
        });
        setTimeout(scrollMessages, 500);
    },
    "click .load-older": function() {
        var limit = Session.get("currentLimit") || 10;
        Session.set("currentLimit", limit + 10);
    }
});
