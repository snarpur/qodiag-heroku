(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.FilterItem = (function(_super) {
    __extends(FilterItem, _super);

    function FilterItem() {
      return FilterItem.__super__.constructor.apply(this, arguments);
    }

    FilterItem.prototype.template = 'filtersItemTmpl';

    FilterItem.prototype.tagName = 'li';

    FilterItem.prototype.events = {
      "change select": "filter"
    };

    FilterItem.prototype.filter = function() {
      return this.model.set("normReferenceId", this.$el.find(":selected").attr("id"));
    };

    return FilterItem;

  })(App.Marionette.ItemView);

  App.Views.FilterList = (function(_super) {
    __extends(FilterList, _super);

    function FilterList() {
      return FilterList.__super__.constructor.apply(this, arguments);
    }

    FilterList.prototype.itemView = App.Views.FilterItem;

    FilterList.prototype.tagName = 'ul';

    FilterList.prototype.className = 'chart-filters';

    return FilterList;

  })(App.Marionette.CollectionView);

}).call(this);
