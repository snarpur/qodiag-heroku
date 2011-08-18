/* DO NOT MODIFY. This file was compiled Thu, 18 Aug 2011 14:57:23 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/show.coffee
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
  (_base = App.Views).ResponderItems || (_base.ResponderItems = {});
  App.Views.ResponderItems.Show = (function() {
    __extends(Show, Backbone.View);
    function Show() {
      this.render = __bind(this.render, this);
      this.renderChart = __bind(this.renderChart, this);
      this.inlineAttributes = __bind(this.inlineAttributes, this);
      this.plotOptions = __bind(this.plotOptions, this);
      this.dataLabelFormatter = __bind(this.dataLabelFormatter, this);
      this.barLabels = __bind(this.barLabels, this);
      this.getElClass = __bind(this.getElClass, this);
      this.chart = __bind(this.chart, this);
      this.setPosition = __bind(this.setPosition, this);
      this.dialog = __bind(this.dialog, this);
      this.dialogId = __bind(this.dialogId, this);
      this.chartDivId = __bind(this.chartDivId, this);
      this.contractLine = __bind(this.contractLine, this);
      this.expandLine = __bind(this.expandLine, this);
      this.line = __bind(this.line, this);
      this.remove = __bind(this.remove, this);
      this.initialize = __bind(this.initialize, this);
      Show.__super__.constructor.apply(this, arguments);
    }
    Show.prototype.template = function() {
      return JST['show'];
    };
    Show.prototype.events = {
      "click .close": "remove"
    };
    Show.prototype.initialize = function(item) {
      this.el = $(this.el);
      return this.model.view = this;
    };
    Show.prototype.elements = {};
    Show.prototype.remove = function() {
      this.contractLine();
      return this.el.remove();
    };
    Show.prototype.line = function() {
      var _base2, _ref;
            if ((_ref = (_base2 = this.elements).line) != null) {
        _ref;
      } else {
        _base2.line = $("#line-" + (this.model.get('access_code')));
      };
      return this.elements.line;
    };
    Show.prototype.expandLine = function() {
      return this.line().switchClass('closed', 'open', 1000);
    };
    Show.prototype.contractLine = function() {
      return this.line().switchClass('open', 'closed', 1000);
    };
    Show.prototype.chartDivId = function() {
      return "" + (this.model.get('access_code')) + "-chart";
    };
    Show.prototype.dialogId = function() {
      return "chart-dialog";
    };
    Show.prototype.dialog = function() {
      return $("#" + (this.dialogId()));
    };
    Show.prototype.setPosition = function() {
      return this.el.css({
        top: this.line().position().top + this.model.getTimeline('line_height')
      });
    };
    Show.prototype.chart = function(item) {
      return this.model.get('chart')[item];
    };
    Show.prototype.getElClass = function() {
      return "chart-dialog";
    };
    Show.prototype.barLabels = function() {
      return this.chart('bar_labels').map(function(label) {
        return label.name;
      });
    };
    Show.prototype.dataLabelFormatter = function() {
      var pointLabels;
      pointLabels = this.chart('point_labels');
      return {
        formatter: function() {
          var groupIndex, range, resultNameIndex;
          console.log(this, "CHART FORMATTER");
          groupIndex = this.series.xAxis.categories.indexOf(this.x);
          resultNameIndex = this.series.index;
          if (resultNameIndex === 0) {
            return this.y;
          } else {
            range = pointLabels[groupIndex].data[resultNameIndex - 1];
            return range;
          }
        }
      };
    };
    Show.prototype.plotOptions = function() {
      if (this.chart('plot_options') != null) {
        _.extend(this.chart('plot_options').column.dataLabels, this.dataLabelFormatter());
      }
      return this.chart('plot_options');
    };
    Show.prototype.inlineAttributes = function() {
      var attr;
      attr = {
        id: this.dialogId(),
        "class": this.getElClass()
      };
      return attr;
    };
    Show.prototype.highChart = function(chart) {
      var opt;
      console.info("HighChart Config", chart);
      return opt = {
        chart: {
          renderTo: chart.name,
          type: chart.type
        },
        plotOptions: chart.plot_options,
        xAxis: {
          categories: chart.bar_labels,
          labels: {
            align: left,
            rotation: 30
          }
        },
        series: chart.data
      };
    };
    Show.prototype.renderChart = function(chart) {
      chart = chart.chart;
      $(this.el).append(JST['chart'](chart));
      return new Highcharts.Chart(this.highChart(chart));
    };
    Show.prototype.render = function() {
      var chart, _i, _len, _ref;
      console.log("CHARTS-----", this.model.get('charts'));
      this.el.attr(this.inlineAttributes());
      this.el.html(this.template()(this.model.toJSON()));
      $("#canvas").append(this.el);
      this.setPosition();
      _ref = this.model.get('charts');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chart = _ref[_i];
        this.renderChart(chart);
      }
      this.expandLine();
      return this;
    };
    return Show;
  })();
}).call(this);
