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

var urlRegex = // based on https://gist.github.com/dperini/729294
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    // TLD may end with dot
    "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?";

slackFormat = function(text) {
    if(!text){
        return false;
    }

    return text
        // .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        // .replace(/[-]+&gt;/g, "→")
        // .replace(/&lt;[-]+/g, "←")
        .replace("&lt;\!channel&gt;", "@channel")
        .replace(/:([a-z0-9+_-]+):/gi, insertEmoji)
        .replace(/(^|\s)\*([^\*]+)\*(\s|$)?/gi, "$1<b>$2</b>$3")
        .replace(/(^|\s)_([^_]+)_(\s|$)?/gi, "$1<i>$2</i>$3")
        .replace(/\n/g, "<br />")
        .replace(new RegExp("&lt;(" + urlRegex + ")&gt;", "gi"), "<a href='$1' target='_blank'>$1</a>")
        .replace(new RegExp("&lt;(" + urlRegex + ")[|](?!&gt;)(.*)&gt;", "gi"), "<a href='$1' target='_blank'>$2</a>")
        .replace(/&lt;(mailto:[^\|]+@[^\|]+)\|([^\|]+@[^\|]+)&gt;/gi, "<a href='$1' target='_blank'>$2</a>")
        .replace(/&lt;@(U[A-Z0-9]+)\|([a-z0-9]+)&gt;/, "<a href='/u/$1'>@$2</a>") //user joined
        .replace(/&lt;@(U[A-Z0-9]+)&gt;/g, createUserLink) //user mention
        .replace(/(```)([^`]*)(```)/gi, "<pre>$2</pre>").replace(/<pre>([\b])*<br \/>/, "<pre>")
        .replace(/`([^`]*)`/gi, "<code>$1</code>")
        // .replace(/> (*)$/i, "<span class=indent>$1</span>")
    ;
    // https://slack.zendesk.com/hc/en-us/articles/202288908-Formatting-your-messages
    // TODO indent, multiline <blockquote>
};
