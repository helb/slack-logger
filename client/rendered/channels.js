Template.channels.rendered = function() {
	var routePath = Router.current().route.getName();
	if (/^c\.:*/.test(routePath)) {
		setTimeout(function() {
			var channeliD = window.location.href.replace(/.*\//, "");
			q(".channels .channel-link[href='/c/" + channeliD + "']").classList.add("active");
		}, 150);
	}
}