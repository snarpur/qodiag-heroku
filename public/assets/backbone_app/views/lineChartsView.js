(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).LineCharts || (_base.LineCharts = {});

  App.Views.LineCharts = (function(_super) {
    __extends(LineCharts, _super);

    function LineCharts() {
      this.renderCharts = __bind(this.renderCharts, this);
      this.renderChart = __bind(this.renderChart, this);
      this.chartWidth = __bind(this.chartWidth, this);
      return LineCharts.__super__.constructor.apply(this, arguments);
    }

    LineCharts.prototype.className = "line-chart";

    LineCharts.prototype.initialize = function() {
      return this.timeline = this.options.timeline;
    };

    LineCharts.prototype.template = function() {
      return JST['backbone_app/templates/lineChartsTmpl'];
    };

    LineCharts.prototype.chartWidth = function(chart) {
      var width;
      return width = (this.timeline.get('canvas_width') * 0.8) + 22;
    };

    LineCharts.prototype.renderChart = function(chart) {
      var chartEl, formatter, high;
      chartEl = $(this.template()(chart));
      $(this.el).append(chartEl);
      formatter = new App.Lib.ChartFormatters.Line(chart, this);
      formatter.setFormatters();
      chartEl.width(this.chartWidth(chart));
      return high = new Highcharts.Chart(chart);
    };

    LineCharts.prototype.renderCharts = function() {
      return _.each(this.model.get('charts'), this.renderChart);
    };

    LineCharts.prototype.render = function() {
      return this;
    };

    return LineCharts;

  })(Backbone.View);

}).call(this);