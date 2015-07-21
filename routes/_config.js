Router.configure({
	layoutTemplate: "pageLayout",
	loadingTemplate: "loading",
	notFoundTemplate: "notFound",
	trackPageView: true
});

Router.onBeforeAction('loading');