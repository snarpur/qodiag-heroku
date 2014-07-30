(function() {
  this.Qapp = (function(Backbone, Marionette) {
    var App;
    App = new Marionette.Application;
    App.Qodiag = {};
    App.Qodiag.namespace = "Qapp";
    App.on("initialize:before", function(options) {
      App.environment = options.environment;
      return this.currentUser = App.request("set:current:user", options.currentUser);
    });
    App.reqres.setHandler("get:current:user", function() {
      return App.currentUser;
    });
    App.addRegions({
      headerRegion: "#header-region",
      contentRegion: "#content",
      contentHeaderRegion: "#content-header",
      dialogRegion: Marionette.Region.Dialog.extend({
        el: "#dialog-region"
      })
    });
    App.reqres.setHandler("default:region", function() {
      return App.contentRegion;
    });
    App.reqres.setHandler("content:header:region", function() {
      return App.contentHeaderRegion;
    });
    App.commands.setHandler("register:instance", function(instance, id) {
      if (App.environment === "development") {
        return App.register(instance, id);
      }
    });
    App.commands.setHandler("unregister:instance", function(instance, id) {
      if (App.environment === "development") {
        return App.unregister(instance, id);
      }
    });
    Backbone.history.on("route", function() {
      return App.showHideSidebar(App.getCurrentRoute());
    });
    App.on("initialize:after", function(options) {
      if (Backbone.history) {
        Backbone.history.start();
        if (this.routeToCaretakerRoot(this.currentUser)) {
          window.location.href = "/users";
          return;
        }
        if (this.getCurrentRoute() == null) {
          return this.navigate(this.rootUrl(this.currentUser), {
            trigger: true
          });
        }
      }
    });
    return App;
  })(Backbone, Marionette);

}).call(this);