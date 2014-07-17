(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SettingsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.showHeader = function(options) {
        var headerRegion;
        headerRegion = App.request("content:header:region");
        return headerRegion.show(new List.Header({
          model: new Backbone.Model(options)
        }));
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
