var autoReconnect = true;
var autoMark = true;
slack = new Slack(Meteor.settings.slackToken, autoReconnect, autoMark);

Meteor.startup(function() {
	var httpOptions = {
		timeout: 5000,
		headers:  {
			"User-Agent": "Meteor"
		}
	};

	Channels.remove({});
	var channelsJson = JSON.parse(HTTP.get("https://slack.com/api/channels.list?token=" + Meteor.settings.slackToken, httpOptions).content);
	channelsJson.channels.forEach(
		function(channel) {
			Channels.insert({
				_id:  channel.id,
				name: channel.name
			});
		});
	console.log("Channels loaded.");

	Users.remove({});
	var usersJson = JSON.parse(HTTP.get("https://slack.com/api/users.list?token=" + Meteor.settings.slackToken, httpOptions).content);
	usersJson.members.forEach(
		function(user) {
			Users.insert({
				_id:  user.id,
				userName: user.name,
				realName: user.real_name,
				avatarUrl: user.profile.image_72
			});
		});
	console.log("Users loaded.");

	Emojis.remove({});
	Meteor.settings.emojiURLs.forEach(
		function(url) {
			urlWithToken = url.replace("{{SLACK_TOKEN}}", Meteor.settings.slackToken);
			var emojiJson = HTTP.get(urlWithToken, httpOptions).data;
			if (typeof(emojiJson.emoji) != "undefined") { // Slack
				emojiList = Object.keys(emojiJson.emoji);
				emojiJson = emojiJson.emoji;
			} else { // Github
				emojiList = Object.keys(emojiJson);
			}
			emojiList.forEach(
				function(emoji) {
					var emojiUrl = emojiJson[emoji]
					if (/^alias:.*/.test(emojiUrl)) {
						var aliasTarget = emojiUrl.replace(/^alias:/, "");
						emojiUrl = emojiJson[aliasTarget];
					}
					if (/^http/.test(emojiUrl)) {
						Emojis.upsert(emoji, {
							$set: {
								"_id":  emoji,
								"url": emojiUrl
							}
						});
					}
				});
			console.log("Emoji from " + url + " loaded.");
		});

	slack.login();
});

var dispatchEvent = function(message) {
	// Meteor.call("logSlackEvent", message)

	if (message.type == "message") {
		var created = message.ts | 0;

		messageDocument = {
			content: message.text,
			author: message.user,
			channel: message.channel,
			created: new Date(created * 1000)
		};

		Meteor.call("addMessage", messageDocument);
	}
}

slack.on('message', Meteor.bindEnvironment(function(message) {
	dispatchEvent(message);
}));
