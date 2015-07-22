Template.sidebar.events({
    "click .logo": function() {
        setTimeout(scrollMessages, 500);
        qa(".channel-link").forEach(function(link){
            link.classList.remove("active");
        });
    }
});
