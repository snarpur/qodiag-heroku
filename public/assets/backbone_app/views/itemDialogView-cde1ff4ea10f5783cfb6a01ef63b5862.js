(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.ItemDialog = (function(_super) {
    __extends(ItemDialog, _super);

    function ItemDialog() {
      this.getLineChart = __bind(this.getLineChart, this);
      this.renderColumnCharts = __bind(this.renderColumnCharts, this);
      this.renderCharts = __bind(this.renderCharts, this);
      this.viewColumnChart = __bind(this.viewColumnChart, this);
      this.viewLineChart = __bind(this.viewLineChart, this);
      this.setDrilldown = __bind(this.setDrilldown, this);
      this.resizeDialog = __bind(this.resizeDialog, this);
      this.setLineHeight = __bind(this.setLineHeight, this);
      this.close = __bind(this.close, this);
      return ItemDialog.__super__.constructor.apply(this, arguments);
    }

    ItemDialog.prototype.className = "line-overlay chart-dialog state-column";

    ItemDialog.prototype.events = {
      "click span.close": "close",
      "click span.line-chart-icn": "viewLineChart",
      "click span.column-chart-icn": "viewColumnChart"
    };

    ItemDialog.prototype.initialize = function() {
      this.line = this.options.line;
      this.timeline = this.options.timeline;
      App.Event.on("chartHeight", this.setLineHeight);
      App.Event.on("drilldown", this.setDrilldown);
      this.line.on('change:currentChartHeight', this.resizeDialog);
      return this.model.set({
        dialogView: this
      });
    };

    ItemDialog.prototype.template = function() {
      return JST['backbone_app/templates/itemDialogTmpl'];
    };

    ItemDialog.prototype.close = function() {
      this.line.set('currentChartHeight', '');
      this.line.trigger("updateDialog", null);
      App.Event.off("chartHeight");
      App.Event.off("drilldown");
      this.line.off('change:currentChartHeight');
      return this.model.set({
        dialogView: null
      });
    };

    ItemDialog.prototype.setLineHeight = function(height) {
      if ((height != null) && height > App.Timeline.Dimensions.line_height_expanded) {
        return this.line.set('currentChartHeight', height);
      } else {
        return this.line.set('currentChartHeight', '');
      }
    };

    ItemDialog.prototype.resizeDialog = function(line) {
      this.$el.closest(".overlay-charts").css("height", line.get('currentChartHeight'));
      return this.$el.css("height", line.get('currentChartHeight'));
    };

    ItemDialog.prototype.setDrilldown = function(state) {
      return this.$el.setCssState(state, "drilldown");
    };

    ItemDialog.prototype.viewLineChart = function() {
      $(this.el).setCssState("line");
      if (this.$(".line-chart").size() === 0) {
        return this.getLineChart();
      }
    };

    ItemDialog.prototype.viewColumnChart = function() {
      return $(this.el).setCssState("column");
    };

    ItemDialog.prototype.renderCharts = function() {
      return this.model.fetch({
        success: (function(_this) {
          return function(model, response) {
            var charts;
            charts = new App.Views.Charts({
              item: model,
              timeline: _this.options.timeline
            });
            _this.$(".chart-wrapper").append(charts.render().el);
            return charts.renderCharts();
          };
        })(this),
        error: function() {
          throw I18n.t("surveys.messages.charts_not_found");
        }
      });
    };

    ItemDialog.prototype.renderColumnCharts = function() {
      var charts;
      charts = new App.Collections.ColumnChart([], {
        responderItem: this.model
      });
      return charts.fetch({
        success: function(collection, response, options) {
          var chartView;
          collection.reset(response.charts, {
            chartMetrics: response.chartMetrics,
            chartFilters: response.chartFilters
          });
          chartView = new App.Views.ColumnChartCollection({
            collection: collection
          });
          return this.$(".chart-wrapper").append(chartView.render().el);
        },
        error: function(collection, xhr, options) {}
      });
    };

    ItemDialog.prototype.getLineChart = function() {
      var id, lineChart, subject_id, that, _ref;
      _ref = [this.line.get("survey_id"), this.timeline.getSubjectId()], id = _ref[0], subject_id = _ref[1];
      lineChart = new App.Models.LineChart({
        item: this.model
      });
      that = this;
      return lineChart.fetch({
        success: function(model, response) {
          var charts;
          charts = new App.Views.LineCharts({
            model: model,
            timeline: that.timeline
          });
          this.$(".chart-wrapper").append(charts.render().el);
          return charts.renderCharts();
        },
        error: function(response) {}
      });
    };

    ItemDialog.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return ItemDialog;

  })(Backbone.View);

}).call(this);