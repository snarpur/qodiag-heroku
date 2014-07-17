(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SettingsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Header = (function(_super) {
      __extends(Header, _super);

      function Header() {
        return Header.__super__.constructor.apply(this, arguments);
      }

      Header.prototype.template = "settings/list/templates/header";

      Header.prototype.className = "state-overview";

      return Header;

    })(App.Views.ItemView);
  });

}).call(this);
