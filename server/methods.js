Meteor.methods({
    addMessage: function(message) {
        if(Match.test(message, Schemas.Message)){
            return Messages.insert(message);
        } else {
            console.log(message);
            return false;
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
        console.log(returnVal);
    },
    removeMessage: function(id, key) {
        if (key === "rybu") {
            return Messages.remove({
                _id: id
            });
        } else {
            return "I need a key.";
        }
    }
});
