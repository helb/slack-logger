var autoReconnect = true;
var autoMark = true;
var slack = new Slack(Meteor.settings.slackToken, autoReconnect, autoMark);

var dispatchEvent = function(message) {
    var created = message.ts | 0; // get rid of decimals

    var messageDocument = {
        content: message.content || message.text || message.message.text,
        author: message.user || message.message.user,
        channel: message.channel,
        type: message.subtype || message.type,
        created: new Date(created * 1000)
    };

    Meteor.call("addMessage", messageDocument);
};

Meteor.startup(function() {
    var httpOptions = {
        timeout: 5000,
        headers: {
            "User-Agent": "Slack Logger"
        }
    };

    Channels.remove({});
    HTTP.get("https://slack.com/api/channels.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
        if (result.data.channels) {
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

    slackUsers.remove({});
    HTTP.get("https://slack.com/api/users.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
        if (result.data.members) {
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
            var urlWithToken = url.replace("{{SLACK_TOKEN}}", Meteor.settings.slackToken);
            var emojiJson = HTTP.get(urlWithToken, httpOptions).data;
            var emojiList = {};
            if (typeof emojiJson.emoji !== "undefined") { // Slack
                emojiList = Object.keys(emojiJson.emoji);
                emojiJson = emojiJson.emoji;
            } else { // Github
                emojiList = Object.keys(emojiJson);
            }
            emojiList.forEach(
                function(emoji) {
                    var emojiUrl = emojiJson[emoji];
                    if (/^alias:.*/.test(emojiUrl)) {
                        var aliasTarget = emojiUrl.replace(/^alias:/, "");
                        emojiUrl = emojiJson[aliasTarget];
                    }
                    if (/^http/.test(emojiUrl)) {
                        Emojis.upsert(emoji, {
                            $set: {
                                "_id": emoji,
                                "url": emojiUrl
                            }
                        });
                    }
                });
        });

    if (Meteor.settings.loadHistory) {
        HTTP.get("https://slack.com/api/channels.list?token=" + Meteor.settings.slackToken, httpOptions, function(error, result) {
            if (result.data.channels) {
                result.data.channels.forEach(function(channel) {
                    HTTP.get("https://slack.com/api/channels.history?token=" + Meteor.settings.slackToken + "&channel=" + channel.id, httpOptions, function(error, result) {
                        if (result.data.messages) {
                            result.data.messages.forEach(function(message) {
                                message.channel = channel.id;
                                dispatchEvent(message);
                            });
                        }
                    });
                });
            }
        });
    };

    slack.login();
});

slack.on("message", Meteor.bindEnvironment(function(message) {
    dispatchEvent(message);
}));
