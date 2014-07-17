(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Components.Charts", function(Charts, App, Backbone, Marionette, $, _) {
    var API;
    Charts.Column = (function(_super) {
      __extends(Column, _super);

      function Column() {
        this.addChartToHistory = __bind(this.addChartToHistory, this);
        this.back = __bind(this.back, this);
        return Column.__super__.constructor.apply(this, arguments);
      }

      Column.prototype.urlRoot = "/responder_items/responses";

      Column.prototype.chartOptionKeys = ["chart", "series", "accessCode", "credits", "legend", "subtitle", "drilldown", "title", "tooltip", "yAxis", "xAxis", "plotOptions"];

      Column.prototype.initialize = function() {
        this.set("chartOptions", this.pick(this.chartOptionKeys));
        this.initHistory();
        this.url = function() {
          var base;
          return base = "" + this.urlRoot + "/" + (this.get('id')) + "/column";
        };
        return Column.__super__.initialize.apply(this, arguments);
      };

      Column.prototype.initHistory = function() {
        var history;
        history = {
          xAxis: {
            categories: _.clone(this.get("chartOptions").xAxis.categories)
          },
          series: _.clone(this.get("chartOptions").series)
        };
        return this.set("drilldownHistory", [history], {
          silent: true
        });
      };

      Column.prototype.chartWidth = function() {
        return this.get('size') / this.collection.totalSize();
      };

      Column.prototype.back = function(options) {
        var base, last;
        if (options == null) {
          options = {};
        }
        if (!this.isChartRoot()) {
          this.get('drilldownHistory').pop();
          last = _.last(this.get('drilldownHistory'));
          base = this.get("chartOptions");
          base.xAxis.categories = last.xAxis.categories;
          base.series = last.series;
          return this.trigger("change:drilldownHistory", {
            config: base,
            type: 'drillup'
          });
        }
      };

      Column.prototype.currentDrilldownLevel = function() {
        return this.get("drilldownHistory").length;
      };

      Column.prototype.isChartRoot = function() {
        return this.get("drilldownHistory").length === 1;
      };

      Column.prototype.addChartToHistory = function(params) {
        var base;
        this.get("drilldownHistory").push(params);
        base = this.get("chartOptions");
        base.xAxis.categories = params.xAxis.categories;
        base.series = params.series;
        return this.trigger('change:drilldownHistory', {
          config: base,
          type: "drilldown"
        });
      };

      return Column;

    })(Backbone.Model);
    Charts.Columns = (function(_super) {
      __extends(Columns, _super);

      function Columns() {
        return Columns.__super__.constructor.apply(this, arguments);
      }

      Columns.prototype.model = Charts.Column;

      Columns.prototype.initialize = function(models, options) {
        this.options = options;
        this.setCurrentMetric(options.currentMetric);
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

      Columns.prototype.parse = function(response) {
        _.extend(this.options, _.omit(response, "charts"));
        return response.charts;
      };

      Columns.prototype.totalSize = function() {
        return _.reduce(this.pluck("size"), (function(memo, num) {
          return memo + num;
        }), 0);
      };

      Columns.prototype.getChartMenu = function() {
        if (this.chartMenu) {
          return this.chartMenu;
        } else {
          return this.chartMenu = new Backbone.Collection(this.options.chartMetrics);
        }
      };

      Columns.prototype.getChartFilter = function() {
        if (this.chartFilters) {
          return this.chartFilters;
        } else {
          return this.chartFilters = new Backbone.Collection(this.options.chartFilters);
        }
      };

      Columns.prototype.responderItemId = function() {
        return this.options.responderItem.get("id");
      };

      Columns.prototype.responderItem = function() {
        return this.options.responderItem;
      };

      Columns.prototype.setCurrentMetric = function(name) {
        return this.currentMetric = name;
      };

      Columns.prototype.setNormReferenceId = function(id) {
        return this.normReferenceId = id;
      };

      return Columns;

    })(Backbone.Collection);
    API = {
      getCharts: (function(_this) {
        return function(options) {
          var charts;
          charts = new Charts.Columns([], {
            responderItem: options.item
          });
          charts.fetch({
            reset: true
          });
          return charts;
        };
      })(this)
    };
    return App.reqres.setHandler("column:charts", function(options) {
      return API.getCharts(options);
    });
  });

}).call(this);
