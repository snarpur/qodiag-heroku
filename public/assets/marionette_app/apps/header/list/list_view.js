(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("HeaderApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Header = (function(_super) {
      __extends(Header, _super);

      function Header() {
        return Header.__super__.constructor.apply(this, arguments);
      }

      Header.prototype.template = "header/list/templates/_header";

      Header.prototype.tagName = "li";

      return Header;

    })(App.Views.ItemView);
    return List.Headers = (function(_super) {
      __extends(Headers, _super);

      function Headers() {
        return Headers.__super__.constructor.apply(this, arguments);
      }

      Headers.prototype.template = "header/list/templates/headers";

      Headers.prototype.itemView = List.Header;

      Headers.prototype.itemViewContainer = "ul";

      return Headers;

    })(App.Views.CompositeView);
  });

}).call(this);