var insertEmoji = function(match, p1) {
    Meteor.subscribe("emoji", p1);
    var emoji = Emojis.findOne({
        "_id": p1
    });
    if (typeof emoji !== "undefined") {
        return "<img src='" + emoji.url + "' title='" + p1 + "' class='emoji' />";
    } else {
        return ":" + p1 + ":";
    }
};


var createUserLink = function(match, p1) {
    var user = Users.find({
        _id: p1
    }).fetch()[0];
    var tooltipName = user.realName || user.userName;
    return "<a href='/u/" + p1 + "' title='" + tooltipName + "'>@" + user.userName + "</a>";
};


slackFormat = function(text) {
    return text
        .replace("<!channel>", "@channel")
        .replace(/\n/g, "<br />")
        .replace(/:([a-z0-9+_-]+):/gi, insertEmoji)
        .replace(/ ?\*([^\*]+)\* ?/gi, " <b>$1</b> ")
        .replace(/\b_([^_]+)_\b/gi, " <i>$1</i> ")
        .replace(/<(https?:\/\/[^ ]*)>/, "<a href='$1'>$1</a>")
        .replace(/<@(U[A-Z0-9]+)\|([a-z0-9]+)>/, "<a href='/u/$1'>@$2</a>") //user joined
        .replace(/<@(U[A-Z0-9]+)>/g, createUserLink) //user mention
        .replace(/(```)([^`]*)(```)/gi, "<pre>$2</pre>").replace(/<pre>([\b])*<br \/>/, "<pre>")
        .replace(/`([^`]*)`/gi, "<code>$1</code>")
        // .replace(/> (*)$/i, "<span class=indent>$1</span>")
    ;
    // https://slack.zendesk.com/hc/en-us/articles/202288908-Formatting-your-messages
    // TODO indent, multiline <blockquote>
};
