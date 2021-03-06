var autoReconnect = true;
var autoMark = true;
var slack = new Slack(Meteor.settings.slackToken, autoReconnect, autoMark);

var httpOptions = {
    timeout: 5000,
    headers: {
        "User-Agent": "Slack Logger"
    }
};

var dispatchEvent = function(message) {
    var created = message.ts | 0; // get rid of decimals
    var user = message.user || message.author || false;

    if (user) {
        var messageDocument = {
            "_id": user + "-" + message.channel + "-" + message.ts,
            "content": message.content || message.text || message.message.text,
            "author": user,
            "channel": message.channel,
            "type": message.subtype || message.type,
            "created": new Date(created * 1000)
        };

        Meteor.call("addMessage", messageDocument);
    }
};

var insertEmoji = function(id, url) {
    if (/^http/.test(url)) {
        Emojis.upsert(id, {
            $set: {
                "_id": id,
                "url": url
            }
        });
    }
}

var getChannelMessages = function(channel, since) {
    var url = "https://slack.com/api/channels.history?token=" + Meteor.settings.slackToken + "&channel=" + channel.id + "&inclusive=1&count=1000";
    if (typeof since !== "undefined") {
        url = url + "&latest=" + since;
    }
    console.log(url);
    HTTP.get(url, httpOptions, function(error, result) {
        if(!result) {
            console.log(error);
        }
        if (result.statusCode === 200) {
            var data = JSON.parse(result.content);
            if (data.messages) {
                var count = 0;
                data.messages.forEach(function(message) {
                    message.channel = channel.id;
                    dispatchEvent(message);
                    count = count + 1;
                });
                console.log(count + " into " + channel.name);
            }
            if (data.has_more === true) {
                var since = data.messages.slice(-1)[0].ts;
                Meteor.setTimeout(function() {
                    getChannelMessages(channel, since);
                }, 15 * 1000);
            }
        } else {
            if (typeof since !== "undefined") {
                Meteor.setTimeout(function() {
                    getChannelMessages(channel, since);
                }, 15 * 1000);
            } else {
                Meteor.setTimeout(function() {
                    getChannelMessages(channel);
                }, 15 * 1000);
            }
            console.log(result.statusCode || error);
        }
    });
}

Meteor.startup(function() {
    if (Meteor.settings.loadHistory) {
        Messages.remove({});
        HTTP.get("https://slack.com/api/channels.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
            if(!result) {
                console.log(error);
            }
            var channels = JSON.parse(result.content);
            if (channels.channels.length > 0) {
                result.data.channels.forEach(function(channel, i) {
                    Meteor.setTimeout(function() {
                        getChannelMessages(channel);
                    }, i * 3000);
                });
            }
        });
    };

    HTTP.get("https://slack.com/api/channels.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
        if (result.data.channels) {
            Channels.remove({});
            result.data.channels.forEach(function(channel) {
                Channels.insert({
                    _id: channel.id,
                    name: channel.name
                });
            });
        } else {
            throw "An error occurred when loading channels. " + error;
        }
    });

    HTTP.get("https://slack.com/api/users.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
        if (result.data.members) {
            slackUsers.remove({});
            result.data.members.forEach(function(user) {
                slackUsers.insert({
                    _id: user.id,
                    userName: user.name,
                    realName: user.real_name,
                    avatarUrl: user.profile.image_72
                });
            });
        } else {
            throw "An error occurred when loading users. " + error;
        }
    });

    Emojis.remove({});
    Meteor.settings.emojiURLs.forEach(
        function(url) {
            var parseEmojiOne = false;
            var urlWithToken = url.replace("{{SLACK_TOKEN}}", Meteor.settings.slackToken);
            HTTP.get(urlWithToken, httpOptions, function(error, response) {
                if (response) {
                    var emojiJson = JSON.parse(response.content);
                    if (typeof emojiJson.emoji !== "undefined") { // Slack
                        emojiList = Object.keys(emojiJson.emoji);
                        emojiJson = emojiJson.emoji;
                        emojiList.forEach(
                            function(emoji) {
                                var emojiUrl = emojiJson[emoji];
                                if (/^alias:.*/.test(emojiUrl)) {
                                    var aliasTarget = emojiUrl.replace(/^alias:/, "");
                                    emojiUrl = emojiJson[aliasTarget];
                                }
                                insertEmoji(emoji, emojiUrl);
                            }
                        );
                    } else { // emojiOne
                        emojiList = Object.keys(emojiJson);
                        emojiList.forEach(
                            function(emoji) {
                                var emojiUrl = "https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.6/assets/png/" + emojiJson[emoji].unicode + ".png";
                                insertEmoji(emoji, emojiUrl);
                                if (emojiJson[emoji].aliases.length > 0) {
                                    emojiJson[emoji].aliases.forEach(function(alias) {
                                        insertEmoji(alias.replace(/^:/, "").replace(/:$/, ""), emojiUrl);
                                    })
                                }
                            }
                        );
                    }
                }
            });
        });

    if (!Meteor.settings.offlineMode) {
        slack.login();
    }
});

slack.on("message", Meteor.bindEnvironment(function(message) {
    dispatchEvent(message);
}));
