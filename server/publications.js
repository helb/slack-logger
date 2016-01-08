Meteor.publish("messages", function(filter, limit) {
    return Messages.find(filter, {
        limit: limit,
        sort: {
            created: -1
        }
    });
});

Meteor.publish("oneMessage", function(id) {
    return Messages.find({
        _id: id
    });
});

Meteor.publish("channels", function() {
    return Channels.find();
});

Meteor.publish("slackUsers", function() {
    return slackUsers.find();
});

Meteor.publish("emoji", function(id) {
    return Emojis.find({
        _id: id
    });
});

var mergeObjects = function(obj1, obj2) {
    var obj3 = {};
    var attrname;
    for (attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
};

Meteor.publish("searchMessages", function(searchValue, type, scope, scopeId, limit) {
    if (!searchValue) {
        return null;
    }

    console.log(searchValue, type, scope, scopeId);

    var scopeFilter = {};

    if (scope && scopeId) {
        if (scope === "channel") {
            scopeFilter = {
                "channel": scopeId
            };
        } else if (scope === "user") {
            scopeFilter = {
                "author": scopeId
            };
        }
    }

    var searchFilter = {};
    var filter = {};

    if (type === "fulltext") {
        searchFilter = {
            content: new RegExp("(" + searchValue.replace(/[\/\\\|\(\)\*\.\[\]\?\!\+\-]/, "").replace(" ", "|") + ")", "i")
        };
        filter = mergeObjects(searchFilter, scopeFilter);
        console.log("fulltext: ", filter);
        return Messages.find(filter, {
            limit: limit,
            sort: {
                created: -1
            }
        });
    } else if (type === "regex") {
        var regexIsValid;

        try {
            var regex = new RegExp(searchValue);
            regexIsValid = true;
        } catch (e) {
            regexIsValid = false;
        }

        if (regexIsValid) {
            searchFilter = {
                content: regex
            };
            filter = mergeObjects(searchFilter, scopeFilter);
            console.log("  regexp: ", filter);
            return Messages.find(filter, {
                limit: limit,
                sort: {
                    created: -1
                }
            });
        } else {
            console.log("  regexp: ", filter, " -- invalid");
        }
    }
});
