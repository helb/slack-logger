Template.channels.events({
    "click .channel-link": function(event) {
        qa(".channel-link").forEach(function(link){
            link.classList.remove("active");
        });
        event.target.classList.add("active");
        setTimeout(scrollMessages, 500);
    }
});
