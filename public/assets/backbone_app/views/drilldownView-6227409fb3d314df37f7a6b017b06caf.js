(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Drilldown = (function(_super) {
    __extends(Drilldown, _super);

    function Drilldown() {
      this.render = __bind(this.render, this);
      this.showDrilldownReset = __bind(this.showDrilldownReset, this);
      this.drillup = __bind(this.drillup, this);
      this.setDrilldown = __bind(this.setDrilldown, this);
      this.initialize = __bind(this.initialize, this);
      return Drilldown.__super__.constructor.apply(this, arguments);
    }

    Drilldown.prototype.className = "reset-drilldown-icn";

    Drilldown.prototype.tagName = "span";

    Drilldown.prototype.events = {
      "click": "drillup"
    };

    Drilldown.prototype.initialize = function(chart) {
      this.chart = this.options.chart;
      this.model = new App.Lib.ChartEvents.Drilldown({
        chart: this.chart
      });
      this.model.on("change:paramsHistory", this.setDrilldown);
      return this.render();
    };

    Drilldown.prototype.setDrilldown = function() {
      var chart, highChart, list, params;
      this.chart.removeActiveChartEl();
      params = this.model.getCurrentChartParams();
      chart = this.isChart(params) ? params : new App.Views.QuestionResponseList({
        collection: params
      }).render();
      if (this.isChart(chart)) {
        chart.chart.renderTo = this.chart.chartContainer();
        highChart = new Highcharts.Chart(chart);
        this.chart.set("activeChart", highChart);
      } else {
        list = new App.Views.QuestionResponseList({
          collection: params
        });
        $(this.chart.chartContainer()).append(list.render().el);
        this.chart.set("activeChart", list);
        list.adjust();
      }
      return this.showDrilldownReset(chart);
    };

    Drilldown.prototype.drillup = function() {
      App.Event.trigger("chartHeight", '');
      return this.model.drillup();
    };

    Drilldown.prototype.isChart = function(params) {
      return params instanceof App.Models.ColumnChart || _.has(params, 'chart');
    };

    Drilldown.prototype.isRootChart = function() {
      return this.model.get("paramsHistory").length === 1;
    };

    Drilldown.prototype.showDrilldownReset = function(chart) {
      if (!this.isRootChart()) {
        App.Event.trigger("drilldown", 'on');
        return this.chart.set("drilldownStatus", 'on');
      } else {
        App.Event.trigger("drilldown", 'off');
        return this.chart.set("drilldownStatus", 'off');
      }
    };

    Drilldown.prototype.render = function() {
      return this.chart.view.$el.prepend(this.el);
    };

    return Drilldown;

  })(Backbone.View);

}).call(this);
