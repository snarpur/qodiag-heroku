(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.MetricsMenuItem = (function(_super) {
    __extends(MetricsMenuItem, _super);

    function MetricsMenuItem() {
      this.deActivate = __bind(this.deActivate, this);
      return MetricsMenuItem.__super__.constructor.apply(this, arguments);
    }

    MetricsMenuItem.prototype.template = 'metricsMenuItemTmpl';

    MetricsMenuItem.prototype.tagName = 'li';

    MetricsMenuItem.prototype.className = function() {
      if (this.model.get('isActive')) {
        return 'active';
      } else {
        return '';
      }
    };

    MetricsMenuItem.prototype.triggers = {
      "click": "activate"
    };

    MetricsMenuItem.prototype.initialize = function() {
      this.on("activate", this.activate);
      return this.listenTo(this.model.collection, "change:isActive", this.deActivate);
    };

    MetricsMenuItem.prototype.activate = function() {
      if (!this.model.get("isActive")) {
        return this.model.set("isActive", true);
      }
    };

    MetricsMenuItem.prototype.deActivate = function(model) {
      if (model.cid !== this.model.cid) {
        return this.model.set("isActive", false, {
          silent: true
        });
      }
    };

    return MetricsMenuItem;

  })(App.Marionette.ItemView);

  App.Views.MetricsMenuList = (function(_super) {
    __extends(MetricsMenuList, _super);

    function MetricsMenuList() {
      return MetricsMenuList.__super__.constructor.apply(this, arguments);
    }

    MetricsMenuList.prototype.itemView = App.Views.MetricsMenuItem;

    MetricsMenuList.prototype.tagName = 'ul';

    MetricsMenuList.prototype.className = 'chart-metrics';

    return MetricsMenuList;

  })(App.Marionette.CollectionView);

}).call(this);
