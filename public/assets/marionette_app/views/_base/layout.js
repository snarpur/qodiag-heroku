(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.serializeData = function() {
        if (this.model) {
          return this.model.attributes;
        }
      };

      Layout.prototype.initialize = function() {
        Layout.__super__.initialize.apply(this, arguments);
        return this.extendTemplateHelpers(this.templateHelpers);
      };

      return Layout;

    })(Marionette.Layout);
  });

}).call(this);
