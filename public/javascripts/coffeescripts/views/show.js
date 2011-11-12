/* DO NOT MODIFY. This file was compiled Fri, 07 Oct 2011 13:54:50 GMT from
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
      this.highChart = __bind(this.highChart, this);
      this.inlineAttributes = __bind(this.inlineAttributes, this);
      this.plotOptions = __bind(this.plotOptions, this);
      this.categoryFormatter = __bind(this.categoryFormatter, this);
      this.legendFormatter = __bind(this.legendFormatter, this);
      this.dataLabelFormatter = __bind(this.dataLabelFormatter, this);
      this.chartWidth = __bind(this.chartWidth, this);
      this.getElClass = __bind(this.getElClass, this);
      this.charts = __bind(this.charts, this);
      this.dialogYPosition = __bind(this.dialogYPosition, this);
      this.dialog = __bind(this.dialog, this);
      this.dialogId = __bind(this.dialogId, this);
      this.chartDivId = __bind(this.chartDivId, this);
      this.contractLine = __bind(this.contractLine, this);
      this.expandLine = __bind(this.expandLine, this);
      this.line = __bind(this.line, this);
      this.remove = __bind(this.remove, this);
      this.setDialogAsClosed = __bind(this.setDialogAsClosed, this);
      this.initialize = __bind(this.initialize, this);
      Show.__super__.constructor.apply(this, arguments);
    }
    Show.prototype.template = function() {
      return JST['show'];
    };
    Show.prototype.elements = {};
    Show.prototype.events = {
      "click .close": "setDialogAsClosed"
    };
    Show.prototype.initialize = function(item) {
      this.model.bind("change:openDialog", this.remove);
      this.el = $(this.el);
      return this.model.view = this;
    };
    Show.prototype.setDialogAsClosed = function() {
      console.info("SETTINGDIALOG AS CLOSED");
      return this.model.set({
        openDialog: false
      });
    };
    Show.prototype.remove = function() {
      if (this.model.get(openDialog) === false) {
        this.dialog.empty();
        return this.contactLine();
      }
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
    Show.prototype.dialogYPosition = function() {
      return "top: " + (this.line().position().top + this.model.getTimeline('line_height')) + "px;";
    };
    Show.prototype.charts = function(item) {
      return this.model.get('charts')[item];
    };
    Show.prototype.getElClass = function() {
      return "chart-dialog";
    };
    Show.prototype.chartWidth = function(chart) {
      var width;
      width = this.model.getTimeline('canvas_width') * (chart.size / this.model.get('charts_size_total'));
      return (width * 0.8) + 22;
    };
    Show.prototype.dataLabelFormatter = function() {
      return function() {
        if ((this.point.config.name != null) && this.point.config.name.data_label) {
          return this.point.config.name.data_label;
        } else {
          return this.y;
        }
      };
    };
    Show.prototype.legendFormatter = function() {
      var model;
      model = this.model;
      return function() {
        var _ref;
        return (_ref = model.get('translations')[this.name]) != null ? _ref : this.name;
      };
    };
    Show.prototype.categoryFormatter = function() {
      var model;
      model = this.model;
      return function() {
        var _ref;
        return (_ref = model.get('translations')[this.value]) != null ? _ref : this.value;
      };
    };
    Show.prototype.plotOptions = function(chart) {
      _.extend(chart.plot_options.column.dataLabels, {
        formatter: this.dataLabelFormatter()
      });
      return chart.plot_options;
    };
    Show.prototype.inlineAttributes = function() {
      var attr;
      attr = {
        id: this.dialogId(),
        "class": this.getElClass(),
        style: this.dialogYPosition()
      };
      return attr;
    };
    Show.prototype.highChart = function(chart) {
      var opt;
      opt = {
        credits: {
          enabled: false
        },
        chart: {
          title: chart.chart.title,
          renderTo: chart.name,
          marginBottom: chart.chart.marginBottom,
          type: chart.chart.type
        },
        tooltip: {
          enabled: false
        },
        plotOptions: this.plotOptions(chart),
        xAxis: {
          categories: chart.categories,
          labels: {
            formatter: this.categoryFormatter()
          }
        },
        series: chart.data
      };
      opt['title'] = chart.title;
      if (chart.y_axis != null) {
        opt['yAxis'] = chart.y_axis;
      }
      opt['legend'] = _.extend(chart.legend, {
        labelFormatter: this.legendFormatter()
      });
      opt['width'] = this.chartWidth(chart);
      _.extend(opt['xAxis'], chart.x_axis);
      return opt;
    };
    Show.prototype.renderChart = function(chart) {
      var high;
      chart = chart;
      $(this.el).append(JST['chart'](_.extend(chart, {
        width: this.chartWidth(chart)
      })));
      return high = new Highcharts.Chart(this.highChart(chart));
    };
    Show.prototype.render = function() {
      var chart, _i, _len, _ref;
      console.info(this);
      this.model.set({
        openDialog: true
      });
      this.expandLine();
      this.el.attr(this.inlineAttributes());
      this.el.html(this.template()(this.model.toJSON()));
      $("#canvas").append(this.el);
      _ref = this.model.get('charts');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chart = _ref[_i];
        this.renderChart(chart);
      }
      return this;
    };
    return Show;
  })();
}).call(this);
