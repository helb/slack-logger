Template.sidebar.events({
	"click .logo": function(event) {
		setTimeout(scrollMessages, 500);
		qa(".channel-link").forEach(function(link){
			link.classList.remove("active");
		})
	}
});