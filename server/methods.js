Meteor.methods({
    addMessage: function(message) {
        return Messages.insert(message);
        // console.log(slackEvent);
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
            // `fields` is where we can add MongoDB projections. Here we're causing
            // each document published to include a property named `score`, which
            // contains the document's search rank, a numerical value, with more
            // relevant documents having a higher score.
            fields: {
                score: {
                    $meta: "textScore"
                }
            },
            // This indicates that we wish the publication to be sorted by the
            // `score` property specified in the projection fields above.
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
