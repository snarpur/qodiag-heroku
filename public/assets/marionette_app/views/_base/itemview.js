(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.ItemView = (function(_super) {
      __extends(ItemView, _super);

      function ItemView() {
        return ItemView.__super__.constructor.apply(this, arguments);
      }

      ItemView.prototype.serializeData = function() {
        return this.model.attributes;
      };

      ItemView.prototype.initialize = function() {
        ItemView.__super__.initialize.apply(this, arguments);
        return this.extendTemplateHelpers(this.templateHelpers);
      };

      ItemView.prototype.changeErrors = function() {};

      return ItemView;

    })(Marionette.ItemView);
  });

}).call(this);
