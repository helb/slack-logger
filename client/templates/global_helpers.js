Template.registerHelper("formatDate", function(date) {
    return moment(date).format("D.M.YYYY HH:mm:ss");
});

Template.registerHelper("formatMessage", function(text) {
    return slackFormat(text);
});
