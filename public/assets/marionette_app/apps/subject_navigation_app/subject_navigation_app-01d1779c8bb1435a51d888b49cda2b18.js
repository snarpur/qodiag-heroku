(function() {
  this.Qapp.module("SubjectNavigationApp", function(SubjectNavigationApp, App, Backbone, Marionette, $, _) {
    var API;
    API = {
      list: function(options) {
        var ctrl;
        ctrl = new SubjectNavigationApp.List.Controller();
        return ctrl.list(options);
      }
    };
    return App.commands.setHandler("show:subject:navigation", function(options) {
      return API.list(options);
    });
  });

}).call(this);
