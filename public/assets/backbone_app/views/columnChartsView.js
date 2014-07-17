(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.ColumnChartItem = (function(_super) {
    __extends(ColumnChartItem, _super);

    function ColumnChartItem() {
      this.setDrilldown = __bind(this.setDrilldown, this);
      return ColumnChartItem.__super__.constructor.apply(this, arguments);
    }

    ColumnChartItem.prototype.template = 'chartsTmpl';

    ColumnChartItem.prototype.className = 'chart';

    ColumnChartItem.prototype.onRender = function() {
      this.model.setup(this);
      return this.model.on('change:drilldownStatus', this.setDrilldown);
    };

    ColumnChartItem.prototype.onClose = function() {
      if (this.model.get('activeChart') instanceof Highcharts.Chart) {
        return this.model.get('activeChart').destroy();
      }
    };

    ColumnChartItem.prototype.setDrilldown = function(model, status, options) {
      return this.$el.setCssState(status, "drilldown");
    };

    return ColumnChartItem;

  })(App.Marionette.ItemView);

  App.Views.ColumnChartCollection = (function(_super) {
    __extends(ColumnChartCollection, _super);

    function ColumnChartCollection() {
      this.filterResult = __bind(this.filterResult, this);
      this.fetchMetricResult = __bind(this.fetchMetricResult, this);
      return ColumnChartCollection.__super__.constructor.apply(this, arguments);
    }

    ColumnChartCollection.prototype.template = 'emptyTmpl';

    ColumnChartCollection.prototype.className = 'column-chart';

    ColumnChartCollection.prototype.itemView = App.Views.ColumnChartItem;

    ColumnChartCollection.prototype.onRender = function() {
      if (this.menuView) {
        this.$el.prepend(this.menuView.render().el);
      }
      if (this.filtersView) {
        this.$el.prepend(this.filtersView.render().el);
      }
      if (this.filterView) {
        return this.$el.prepend(this.filterView.render().el);
      }
    };

    ColumnChartCollection.prototype.initialize = function(options) {
      this.menu = options.collection.getMetricMenu();
      if (this.menu != null) {
        this.menuView = new App.Views.MetricsMenuList({
          collection: this.menu
        });
        this.listenTo(this.menu, 'change:isActive', this.fetchMetricResult);
      }
      this.filter = options.collection.getFilters();
      if (this.filter != null) {
        this.filtersView = new App.Views.FilterList({
          collection: this.filter
        });
        return this.listenTo(this.filter, 'change:normReferenceId', this.filterResult);
      }
    };

    ColumnChartCollection.prototype.fetchMetricResult = function(model) {
      var callbacks, view;
      view = this;
      callbacks = {
        success: function(collection, response) {
          collection.reset(response.charts, {
            chartMetrics: response.chartMetrics
          });
          return view.menuView.render();
        },
        error: function(collection, xhr) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "App.Views.ColumnChartCollection:fetchMetricResult - Collection not found"
          });
        },
        silent: true
      };
      return this.collection.fetch(callbacks);
    };

    ColumnChartCollection.prototype.filterResult = function(model) {
      var callbacks, view;
      view = this;
      callbacks = {
        success: function(collection, response) {
          collection.reset(response.charts, {
            chartFilters: response.chartFilters
          });
          return view.menuView.render();
        },
        error: function(collection, xhr) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "App.Views.ColumnChartCollection:filterResult - Collection not found"
          });
        },
        silent: true
      };
      return this.collection.fetch(callbacks);
    };

    return ColumnChartCollection;

  })(App.Marionette.CompositeView);

}).call(this);
