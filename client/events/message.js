Template.messages.events({
	"click .message-header a": function(event) {
		qa(".channel-link").forEach(function(link){
			link.classList.remove("active");
		})
		setTimeout(scrollMessages, 500);
	}
});