(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.ColumnChart = (function(_super) {
    __extends(ColumnChart, _super);

    function ColumnChart() {
      return ColumnChart.__super__.constructor.apply(this, arguments);
    }

    ColumnChart.prototype.urlRoot = "/responder_items/responses";

    ColumnChart.prototype.initialize = function() {
      return this.url = function() {
        var base;
        base = "" + this.urlRoot + "/" + (this.get('id')) + "/column";
        if (this.get("columnMetrics")) {
          base = "" + base + "/" + (this.get('columnMetrics'));
        }
        return base;
      };
    };

    ColumnChart.prototype.chartWidth = function() {
      var width;
      width = App.Timeline.Dimensions.canvas_width * (this.get('size') / this.collection.totalSize());
      return this.get('chart').width = (width * 0.8) + 22;
    };

    ColumnChart.prototype.renderTo = function(view) {
      return this.get('chart').renderTo = this.view.$("> div")[0];
    };

    ColumnChart.prototype.chartContainer = function() {
      return this.view.$(" > div")[0];
    };

    ColumnChart.prototype.setFormatters = function() {
      var formatter;
      formatter = new App.Lib.ChartFormatters.Column(this.attributes);
      return formatter.setFormatters();
    };

    ColumnChart.prototype.responderItem = function() {
      return this.collection.responderItem();
    };

    ColumnChart.prototype.drillDownSetup = function() {
      var drilldown;
      if (this.get('questionListDrilldown')) {
        return drilldown = new App.Views.Drilldown({
          chart: this
        });
      }
    };

    ColumnChart.prototype.removeActiveChartEl = function(drilldown, callback) {
      if (this.get("activeChart") instanceof Backbone.View) {
        return this.get("activeChart").remove();
      } else {
        return this.get("activeChart").destroy();
      }
    };

    ColumnChart.prototype.setup = function(view) {
      var highChart;
      this.view = view;
      this.chartWidth();
      this.renderTo();
      this.setFormatters();
      this.drillDownSetup();
      console.log(JSON.stringify(this.attributes));
      console.warn(this.attributes);
      highChart = new Highcharts.Chart(this.attributes);
      return this.set("activeChart", highChart);
    };

    return ColumnChart;

  })(Backbone.Model);

  App.Collections.ColumnChart = (function(_super) {
    __extends(ColumnChart, _super);

    function ColumnChart() {
      return ColumnChart.__super__.constructor.apply(this, arguments);
    }

    ColumnChart.prototype.model = App.Models.ColumnChart;

    ColumnChart.prototype.initialize = function(models, options) {
      this.options = options;
      this.setCurrentMetric(options.currentMetric);
      this.on('reset', (function(_this) {
        return function(models, options) {
          _this.setMetricMenu(models, options);
          return _this.setFilters(models, options);
        };
      })(this));
      return this.url = function() {
        var url;
        url = "/responder_items/responses/:id/column";
        url = url.replace(/\:id/, this.responderItemId());
        if (!_.isEmpty(this.currentMetric)) {
          if (!_.isEmpty(this.normReferenceId)) {
            url = "" + url + "/norm_reference/" + this.normReferenceId + "/" + this.currentMetric;
          } else {
            url = "" + url + "/" + this.currentMetric;
          }
        } else {
          if (!_.isEmpty(this.normReferenceId)) {
            url = "" + url + "/norm_reference/" + this.normReferenceId;
          }
        }
        return url;
      };
    };

    ColumnChart.prototype.totalSize = function() {
      return _.reduce(this.pluck("size"), (function(memo, num) {
        return memo + num;
      }), 0);
    };

    ColumnChart.prototype.metricsMenu = function() {
      return _.map(this.at(0).attributes.chartMetrics, (function(i) {
        i.isActive = i.query === this.getCurrentMetric();
        return i;
      }), this);
    };

    ColumnChart.prototype.filters = function() {
      return _.map(this.at(0).attributes.chartFilters, (function(i) {
        return i;
      }), this);
    };

    ColumnChart.prototype.responderItemId = function() {
      return this.options.responderItem.get("id");
    };

    ColumnChart.prototype.responderItem = function() {
      return this.options.responderItem;
    };

    ColumnChart.prototype.setMetricMenu = function(models, options) {
      if ((options.chartMetrics == null) || (this.metricMenu != null)) {
        return;
      }
      _.first(options.chartMetrics).isActive = true;
      this.metricMenu = new Backbone.Collection(options.chartMetrics);
      return this.listenTo(this.metricMenu, "change:isActive", function(model) {
        return this.setCurrentMetric(model.get('name'));
      });
    };

    ColumnChart.prototype.setFilters = function(models, options) {
      if ((options.chartFilters == null) || (this.selectFilter != null)) {
        return;
      }
      this.selectFilter = new Backbone.Collection(options.chartFilters);
      return this.listenTo(this.selectFilter, 'change:normReferenceId', function(model) {
        return this.setNormReferenceId(model.get('normReferenceId'));
      });
    };

    ColumnChart.prototype.getMetricMenu = function() {
      return this.metricMenu;
    };

    ColumnChart.prototype.getFilters = function() {
      return this.selectFilter;
    };

    ColumnChart.prototype.setCurrentMetric = function(name) {
      return this.currentMetric = name;
    };

    ColumnChart.prototype.setNormReferenceId = function(id) {
      return this.normReferenceId = id;
    };

    ColumnChart.prototype.getCurrentMetric = function() {
      return this.currentMetric || _.first(this.at(0).attributes.chartMetrics).name;
    };

    return ColumnChart;

  })(Backbone.Collection);

}).call(this);
