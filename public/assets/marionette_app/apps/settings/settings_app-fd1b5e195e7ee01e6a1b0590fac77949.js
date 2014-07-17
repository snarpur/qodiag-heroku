(function() {
  this.Qapp.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _) {
    var API;
    API = {
      showSettingsRegion: function(options) {
        var ctrl;
        ctrl = new SettingsApp.List.Controller();
        return ctrl.showHeader(options);
      }
    };
    return App.commands.setHandler("show:settings:navigation", function(options) {
      return API.showSettingsRegion(options);
    });
  });

}).call(this);
