(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.CompositeView = (function(_super) {
      __extends(CompositeView, _super);

      function CompositeView() {
        this.itemViewOptions = __bind(this.itemViewOptions, this);
        return CompositeView.__super__.constructor.apply(this, arguments);
      }

      CompositeView.prototype.itemViewEventPrefix = "childview";

      CompositeView.prototype.serializeData = function() {
        return _.map(this.collection.models, function(i) {
          return i.attributes;
        });
      };

      CompositeView.prototype.itemViewOptions = function(model, index) {
        var options;
        options = {
          index: index
        };
        if (this.childViewOptions != null) {
          return _.extend(options, this.childViewOptions());
        } else {
          return options;
        }
      };

      CompositeView.prototype.initialize = function() {
        CompositeView.__super__.initialize.apply(this, arguments);
        return this.extendTemplateHelpers(this.templateHelpers);
      };

      return CompositeView;

    })(Marionette.CompositeView);
  });

}).call(this);
