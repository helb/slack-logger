Template.channels.rendered = function() {
    var routePath = Router.current().route.getName();
    if (/^c\.:*/.test(routePath)) {
        setTimeout(function() {
            var channeliD = window.location.href.replace(/.*\//, "");
            var activeChannel = q(".channels .channel-link[href='/c/" + channeliD + "']");
            activeChannel.classList.add("active");
        }, 300);
    };

    var scrollToActiveChannel = function() {
        var channels = q(".channels");
        var activeChannel = q(".channel-link.active");
        if (activeChannel && channels.scrollHeight > channels.offsetHeight) {
            channels.scrollTop = activeChannel.offsetTop;
        }
    }
    setTimeout(scrollToActiveChannel, 500);
};
