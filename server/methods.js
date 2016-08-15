Meteor.methods({
    addMessage: function(message) {
        if(Match.test(message, Schemas.Message)){
            try {
                return Messages.insert(message);
            }
            catch(e){
                return false;
            }
        } else {
            console.log("\n", message, "\n");
            throw "Invalid message."
        }
    },
    searchMsgs: function(searchValue) {
        var returnVal = {};
        if (!searchValue) {
            returnVal = null;
        }
        returnVal = Messages.find({
            $text: {
                $search: searchValue
            }
        }, {
            fields: {
                score: {
                    $meta: "textScore"
                }
            },
            sort: {
                score: {
                    $meta: "textScore"
                }
            }
        });
    },
    removeMessage: function(id, key) {
        if (key === Meteor.settings.removeKey) {
            return Messages.remove({
                _id: id
            });
        } else {
            return "I need a key.";
        }
    }
});
