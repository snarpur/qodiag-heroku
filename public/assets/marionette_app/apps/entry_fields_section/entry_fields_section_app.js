(function() {
  this.Qapp.module("EntryFieldsSectionApp", function(EntryFieldsSectionApp, App, Backbone, Marionette, $, _) {
    var API;
    API = {
      listFields: function(options) {
        var ctrl;
        ctrl = new EntryFieldsSectionApp.List.Controller();
        return ctrl.list(options);
      }
    };
    return App.commands.setHandler("show:settings:section:fields", (function(_this) {
      return function(options) {
        return API.listFields(options);
      };
    })(this));
  });

}).call(this);
