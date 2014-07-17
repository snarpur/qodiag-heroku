(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Marionette || (App.Marionette = {});

  App.Marionette.ItemView = (function(_super) {
    __extends(ItemView, _super);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.serializeData = function() {
      return this.model.attributes;
    };

    return ItemView;

  })(Backbone.Marionette.ItemView);

  App.Marionette.CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    return CollectionView;

  })(Backbone.Marionette.CollectionView);

  App.Marionette.CompositeView = (function(_super) {
    __extends(CompositeView, _super);

    function CompositeView() {
      return CompositeView.__super__.constructor.apply(this, arguments);
    }

    return CompositeView;

  })(Backbone.Marionette.CompositeView);

}).call(this);
