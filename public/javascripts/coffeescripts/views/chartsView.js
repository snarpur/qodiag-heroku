/* DO NOT MODIFY. This file was compiled Fri, 14 Oct 2011 12:55:17 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/chartsView.coffee
 */

(function() {
  var _base;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (_base = App.Views).Charts || (_base.Charts = {});
  App.Views.Charts = (function() {
    __extends(Charts, Backbone.View);
    function Charts() {
      this.renderCharts = __bind(this.renderCharts, this);
      this.renderChart = __bind(this.renderChart, this);
      this.highChart = __bind(this.highChart, this);
      this.plotOptions = __bind(this.plotOptions, this);
      this.categoryFormatter = __bind(this.categoryFormatter, this);
      this.legendFormatter = __bind(this.legendFormatter, this);
      this.dataLabelFormatter = __bind(this.dataLabelFormatter, this);
      this.chartWidth = __bind(this.chartWidth, this);
      this.charts = __bind(this.charts, this);
      Charts.__super__.constructor.apply(this, arguments);
    }
    Charts.prototype.initialize = function() {
      return this.timeline = this.options.timeline;
    };
    Charts.prototype.template = function() {
      return JST['chartsTmpl'];
    };
    Charts.prototype.charts = function(item) {
      return this.model.get('charts')[item];
    };
    Charts.prototype.chartWidth = function(chart) {
      var width;
      width = this.timeline.get('canvas_width') * (chart.size / this.model.get('charts_size_total'));
      return (width * 0.8) + 22;
    };
    Charts.prototype.dataLabelFormatter = function() {
      return function() {
        if ((this.point.config.name != null) && this.point.config.name.data_label) {
          return this.point.config.name.data_label;
        } else {
          return this.y;
        }
      };
    };
    Charts.prototype.legendFormatter = function() {
      var model;
      model = this.model;
      return function() {
        var _ref;
        return (_ref = model.get('translations')[this.name]) != null ? _ref : this.name;
      };
    };
    Charts.prototype.categoryFormatter = function() {
      var model;
      model = this.model;
      return function() {
        var _ref;
        return (_ref = model.get('translations')[this.value]) != null ? _ref : this.value;
      };
    };
    Charts.prototype.plotOptions = function(chart) {
      _.extend(chart.plot_options.column.dataLabels, {
        formatter: this.dataLabelFormatter()
      });
      return chart.plot_options;
    };
    Charts.prototype.highChart = function(chart) {
      var opt;
      return opt = {
        tooltip: chart.tooltip,
        credits: chart.credits,
        title: chart.title,
        chart: {
          title: chart.chart.title,
          renderTo: chart.name,
          marginBottom: chart.chart.marginBottom,
          type: chart.chart.type
        },
        plotOptions: this.plotOptions(chart),
        xAxis: {
          categories: chart.categories,
          labels: {
            formatter: this.categoryFormatter()
          }
        },
        yAxis: chart.y_axis,
        legend: _.extend(chart.legend, {
          labelFormatter: this.legendFormatter()
        }),
        series: chart.data
      };
    };
    Charts.prototype.renderChart = function(chart) {
      var chartEl, high;
      chartEl = $(this.template()(chart));
      chartEl.width(this.chartWidth(chart));
      $(this.el).append(chartEl);
      return high = new Highcharts.Chart(this.highChart(chart));
    };
    Charts.prototype.renderCharts = function() {
      return _.each(this.model.get('charts'), this.renderChart);
    };
    Charts.prototype.render = function() {
      return this;
    };
    return Charts;
  })();
}).call(this);
