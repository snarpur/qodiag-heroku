(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Charts || (_base.Charts = {});

  App.Views.Charts = (function(_super) {
    __extends(Charts, _super);

    function Charts() {
      this.renderCharts = __bind(this.renderCharts, this);
      this.renderChart = __bind(this.renderChart, this);
      this.setChartDiv = __bind(this.setChartDiv, this);
      this.chartWidth = __bind(this.chartWidth, this);
      this.charts = __bind(this.charts, this);
      this.unBindEvents = __bind(this.unBindEvents, this);
      return Charts.__super__.constructor.apply(this, arguments);
    }

    Charts.prototype.className = "column-chart";

    Charts.prototype.initialize = function() {
      this.timeline = this.options.timeline;
      this.item = this.options.item;
      return this.item.on("change:dialogView", this.unBindEvents);
    };

    Charts.prototype.template = function() {
      return JST['backbone_app/templates/chartsTmpl'];
    };

    Charts.prototype.unBindEvents = function() {
      if (this.item.get("dialogView") == null) {
        App.Event.off();
        return this.item.off();
      }
    };

    Charts.prototype.charts = function(item) {
      return this.item.get('charts')[item];
    };

    Charts.prototype.chartWidth = function(chart) {
      var total_size, width;
      total_size = 0;
      _.each(this.item.get('charts'), function(n) {
        return total_size += n.size;
      });
      width = this.timeline.get('canvas_width') * (chart.size / total_size);
      return (width * 0.8) + 22;
    };

    Charts.prototype.chartHeight = function() {
      return App.Timeline.Dimensions.line_height_expanded * 0.8;
    };

    Charts.prototype.setChartDiv = function(chart) {
      chart.chart.renderTo = this.$el.find("\#" + chart.chart.renderTo + " > div")[0];
      return chart;
    };

    Charts.prototype.renderChart = function(chart) {
      var chartEl, drilldown, drilldownParams, formatter;
      chartEl = $(this.template()(chart));
      $(this.el).append(chartEl);
      formatter = new App.Lib.ChartFormatters.column(chart);
      chart = formatter.setFormatters();
      chart = this.setChartDiv(chart);
      chart.chart.width = this.chartWidth(chart);
      drilldownParams = {
        chart: chart,
        chartEl: chartEl,
        chartView: this,
        responderItem: this.item
      };
      drilldown = new App.Views.Drilldown(drilldownParams);
      return new Highcharts.Chart(chart);
    };

    Charts.prototype.renderCharts = function() {
      return _.each(this.item.get('charts'), this.renderChart);
    };

    Charts.prototype.render = function() {
      return this;
    };

    return Charts;

  })(Backbone.View);

}).call(this);