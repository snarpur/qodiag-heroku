(function() {
  this.Qapp.module("EntryFieldsSidebarApp", function(EntryFieldsSidebarApp, App, Backbone, Marionette, $, _) {
    var API;
    API = {
      listEntryFields: function(options) {
        var ctrl;
        ctrl = new EntryFieldsSidebarApp.List.Controller;
        return ctrl.list(options);
      }
    };
    return App.commands.setHandler("show:settings:sidebar:fields", (function(_this) {
      return function(options) {
        return API.listEntryFields(options);
      };
    })(this));
  });

}).call(this);
