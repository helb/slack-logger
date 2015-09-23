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

var createChannelLink = function(match, p1) {
    var channel = Channels.find({
        _id: p1
    }).fetch()[0];
    return "<a href='/c/" + p1 + "'>@" + channel.name + "</a>";
};

var createIndentedText = function(match, p1, p2) {
    innerText = p2.replace(/&gt; /g, "");
    return "<div class=indent>" + innerText + "</div>";
};

function replaceOutsideCode(str, pattern, replacement) {
  var codeTags = /(<code>.*?<\/code>)|(<pre>.*?<\/pre>)|(<[^<]*?>)/i;
  return str.split(codeTags).map(function(s) {
    if ("" + s !== s)
      return "";
    if (s.match(codeTags))
      return s;
    return s.replace(pattern, replacement);
  }).join('');
};

var urlRegex = // based on https://gist.github.com/dperini/729294
    // protocol identifier
    "(?:(?:https?|ftp):\/\/)" +
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

    text = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />")
        .replace(/^(&gt;)\s+(.*)/g, createIndentedText)
        .replace(/(```)([^`]*)(```)/gi, "<pre>$2</pre>").replace(/<pre>([\b])*<br \/>/, "<pre>")
        .replace(/`([^`]*)`/gi, "<code>$1</code>")
        .replace(new RegExp("&lt;(" + urlRegex + ")&gt;", "gi"), "<a href='$1' target='_blank'>$1</a>")
        .replace(new RegExp("&lt;(" + urlRegex + ")[|](?!&gt;)(.*)&gt;", "gi"), "<a href='$1' target='_blank'>$2</a>")
        .replace("&lt;\!channel&gt;", "@channel")
        .replace(/:([a-z0-9+_-]+):/gi, insertEmoji)
        // .replace(/\*([^\*]+)\*/gi, "<b>$1</b>")
        // .replace(/_([^_]+)_/gi, "<i>$1</i>")
        .replace(/(^|\s)_([^_]+)(?![^<]*>|[^<>]*<\/)_(\s|$)?/gi, "$1<i>$2</i>$3")
        .replace(/&lt;(mailto:[^\|]+@[^\|]+)\|([^\|]+@[^\|]+)&gt;/gi, "<a href='$1' target='_blank'>$2</a>")
        .replace(/&lt;@(U[A-Z0-9]+)\|([a-z0-9_\.-]+)&gt;/, "<a href='/u/$1'>@$2</a>") //user joined
        .replace(/&lt;@(U[A-Z0-9]+)&gt;/g, createUserLink) //user mention
        .replace(/&lt;#(C[A-Z0-9]+)&gt;/g, createChannelLink) //channel link
    ;

    text = replaceOutsideCode(text, new RegExp("\\*([^\\*]+)\\*", "gi"), "<b>$1</b>");
    text = replaceOutsideCode(text, new RegExp("_([^_]+)_", "gi"), "<i>$1</i>");
    return text;
    // https://slack.zendesk.com/hc/en-us/articles/202288908-Formatting-your-messages
};
