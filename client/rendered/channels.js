Template.channels.rendered = function() {
    var routePath = Router.current().route.getName();
    if (/^c\.:*/.test(routePath)) {
        setTimeout(function() {
            var channeliD = window.location.href.replace(/.*\//, "");
            var activeChannel = q(".channels .channel-link[href='/c/" + channeliD + "']");
            activeChannel.classList.add("active");
        }, 150);
    }
};
