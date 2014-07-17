(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.CollectionView = (function(_super) {
      __extends(CollectionView, _super);

      function CollectionView() {
        this.itemViewOptions = __bind(this.itemViewOptions, this);
        return CollectionView.__super__.constructor.apply(this, arguments);
      }

      CollectionView.prototype.itemViewEventPrefix = "childview";

      CollectionView.prototype.itemViewOptions = function(model, index) {
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

      return CollectionView;

    })(Marionette.CollectionView);
  });

}).call(this);
