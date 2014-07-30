(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.AddRemoveButton = (function(_super) {
    __extends(AddRemoveButton, _super);

    function AddRemoveButton() {
      this.addRemove = __bind(this.addRemove, this);
      return AddRemoveButton.__super__.constructor.apply(this, arguments);
    }

    AddRemoveButton.prototype.initialize = function() {
      return this.form = this.options.form;
    };

    AddRemoveButton.prototype.events = {
      'click button.add-remove-btn': 'addRemove'
    };

    AddRemoveButton.prototype.template = function() {
      return JST['backbone_app/templates/siblingsControllsTmpl'];
    };

    AddRemoveButton.prototype.addRemove = function() {};

    AddRemoveButton.prototype.render = function() {
      if ((this.template() != null)) {
        return this.form.$el.append($(this.el).html(this.template()({})));
      }
    };

    return AddRemoveButton;

  })(Backbone.View);

}).call(this);
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
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.FilterItem = (function(_super) {
    __extends(FilterItem, _super);

    function FilterItem() {
      return FilterItem.__super__.constructor.apply(this, arguments);
    }

    FilterItem.prototype.template = 'filtersItemTmpl';

    FilterItem.prototype.tagName = 'li';

    FilterItem.prototype.events = {
      "change select": "filter"
    };

    FilterItem.prototype.filter = function() {
      return this.model.set("normReferenceId", this.$el.find(":selected").attr("id"));
    };

    return FilterItem;

  })(App.Marionette.ItemView);

  App.Views.FilterList = (function(_super) {
    __extends(FilterList, _super);

    function FilterList() {
      return FilterList.__super__.constructor.apply(this, arguments);
    }

    FilterList.prototype.itemView = App.Views.FilterItem;

    FilterList.prototype.tagName = 'ul';

    FilterList.prototype.className = 'chart-filters';

    return FilterList;

  })(App.Marionette.CollectionView);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.FormRenderer = (function(_super) {
    __extends(FormRenderer, _super);

    function FormRenderer() {
      this.render = __bind(this.render, this);
      this.renderForm = __bind(this.renderForm, this);
      this.renderStepNavigation = __bind(this.renderStepNavigation, this);
      this.renderSteps = __bind(this.renderSteps, this);
      this.bindForm = __bind(this.bindForm, this);
      this.submitForm = __bind(this.submitForm, this);
      this.validateForm = __bind(this.validateForm, this);
      this.initialize = __bind(this.initialize, this);
      return FormRenderer.__super__.constructor.apply(this, arguments);
    }

    FormRenderer.prototype.id = "form-wizard";

    FormRenderer.prototype.className = "form-base form-horizontal";

    FormRenderer.prototype.events = {
      "click button.submit-btn": "validateForm"
    };

    FormRenderer.prototype.initialize = function() {
      this.router = this.options.router;
      this.listenTo(this.model, "destructionComplete", this.submitForm);
      return this;
    };

    FormRenderer.prototype.template = function() {
      return JST['backbone_app/templates/multistepFormTmpl'];
    };

    FormRenderer.prototype.validateForm = function() {
      var errors;
      errors = this.form.commit();
      if (_.isEmpty(errors)) {
        return this.model.destroyInQueue();
      }
    };

    FormRenderer.prototype.submitForm = function() {
      return this.model.save(this.model.toJSON(), this.submitCallbacks());
    };

    FormRenderer.prototype.submitCallbacks = function() {
      var callbacks, view;
      view = this;
      return callbacks = {
        success: function(model, response) {
          if (!(_.isEmpty(response.errors))) {
            view.renderSteps();
            return model.get('formModel').set('formErrors', response.errors);
          } else if (view.model.onLastStep()) {
            return window.location.href = view.model.urlOnComplete();
          } else {
            return view.model.nextStep();
          }
        },
        error: function(model, response) {
          throw I18n.t("marionette.errors.model_not_saved", {
            model: model
          });
        }
      };
    };

    FormRenderer.prototype.bindForm = function(form, model) {
      return _.each(form.fields, function(v, k) {
        return v.model.bindToForm(v.form);
      });
    };

    FormRenderer.prototype.renderSteps = function() {
      var rootModel;
      rootModel = this.model.get("formModel");
      this.form = new Backbone.Form({
        model: rootModel
      }).render();
      $(this.form.el).addClass("form-horizontal");
      this.$('#wizard-fields').empty();
      this.$('#wizard-fields').append(this.form.el);
      return rootModel.set("form", this.form);
    };

    FormRenderer.prototype.renderStepNavigation = function() {
      var step;
      step = new App.Views.MultistepFormNavigation({
        model: this.model
      });
      this.$("." + step.className).remove();
      return $(this.el).prepend(step.render().el);
    };

    FormRenderer.prototype.renderForm = function() {
      this.renderSteps();
      return this.renderStepNavigation();
    };

    FormRenderer.prototype.render = function() {
      $(this.el).html(this.template()({}));
      return this;
    };

    return FormRenderer;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.HeadingsList = (function(_super) {
    __extends(HeadingsList, _super);

    function HeadingsList() {
      this.renderHeading = __bind(this.renderHeading, this);
      this.openSurveyMenu = __bind(this.openSurveyMenu, this);
      return HeadingsList.__super__.constructor.apply(this, arguments);
    }

    HeadingsList.prototype.id = "line-headings";

    HeadingsList.prototype.events = {
      "click button": "openSurveyMenu"
    };

    HeadingsList.prototype.initialize = function() {
      this.lines = this.options.lines;
      this.lines.bind("add", this.renderHeading);
      return this.timeline = this.options.timeline;
    };

    HeadingsList.prototype.template = function() {
      return JST['backbone_app/templates/headingsListTmpl'];
    };

    HeadingsList.prototype.openSurveyMenu = function() {
      return this.timeline.set({
        surveyMenuVisibility: 'open'
      });
    };

    HeadingsList.prototype.renderHeading = function(line) {
      var heading;
      heading = new App.Views.Timeline.LineHeading({
        model: line
      });
      return this.$("ul").append(heading.render().el);
    };

    HeadingsList.prototype.render = function() {
      $(this.el).html(this.template()({}));
      return this;
    };

    return HeadingsList;

  })(Backbone.View);

}).call(this);
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
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views.Timeline).LineHeading || (_base.LineHeading = {});

  App.Views.Timeline.LineHeading = (function(_super) {
    __extends(LineHeading, _super);

    function LineHeading() {
      this.removeHeader = __bind(this.removeHeader, this);
      this.newItem = __bind(this.newItem, this);
      return LineHeading.__super__.constructor.apply(this, arguments);
    }

    LineHeading.prototype.tagName = "li";

    LineHeading.prototype.events = {
      "click span.new-item": "newItem"
    };

    LineHeading.prototype.initialize = function() {
      this.model.headingView = this;
      return this.model.bind("remove", this.removeHeader);
    };

    LineHeading.prototype.newItem = function() {
      return this.model.set({
        newItemOverlayState: 'open'
      });
    };

    LineHeading.prototype.removeHeader = function(line) {
      return $(this.el).remove();
    };

    LineHeading.prototype.template = function() {
      return JST['backbone_app/templates/headingsTmpl'];
    };

    LineHeading.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return LineHeading;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.LineItem = (function(_super) {
    __extends(LineItem, _super);

    function LineItem() {
      this.highlight = __bind(this.highlight, this);
      this.setPosition = __bind(this.setPosition, this);
      this.statusPosition = __bind(this.statusPosition, this);
      this.setStatus = __bind(this.setStatus, this);
      this.show = __bind(this.show, this);
      return LineItem.__super__.constructor.apply(this, arguments);
    }

    LineItem.prototype.tagName = "span";

    LineItem.prototype.className = "item";

    LineItem.prototype.events = {
      "click": "show"
    };

    LineItem.prototype.initialize = function() {
      this.line = this.options.line;
      this.timeline = this.options.timeline;
      this.model.view = this;
      this.setPosition();
      this.setStatus();
      return this.model.bind("change:dialogView", this.highlight);
    };

    LineItem.prototype.template = function() {
      return JST['backbone_app/templates/lineItemTmpl'];
    };

    LineItem.prototype.show = function() {
      if (this.model.status() === "completed") {
        return this.line.trigger("updateDialog", this.model);
      }
    };

    LineItem.prototype.setStatus = function() {
      return $(this.el).addClass(this.model.status());
    };

    LineItem.prototype.statusPosition = function() {
      if (this.model.status() === "completed") {
        return this.model.get("completed");
      } else {
        return this.model.get("deadline");
      }
    };

    LineItem.prototype.setPosition = function() {
      var pos;
      pos = this.timeline.positionOnLine(new Date(this.statusPosition()));
      return $(this.el).css('left', "" + pos + "px");
    };

    LineItem.prototype.highlight = function() {
      if (this.model.get("dialogView")) {
        return $(this.el).addClass('open-dialog');
      } else {
        return $(this.el).removeClass('open-dialog');
      }
    };

    LineItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return LineItem;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Timeline.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.render = __bind(this.render, this);
      this.removeLine = __bind(this.removeLine, this);
      this.removeItems = __bind(this.removeItems, this);
      this.renderAddItemOverlay = __bind(this.renderAddItemOverlay, this);
      this.newItemOverlayState = __bind(this.newItemOverlayState, this);
      this.renderLineItem = __bind(this.renderLineItem, this);
      this.renderLineItems = __bind(this.renderLineItems, this);
      this.renderDialog = __bind(this.renderDialog, this);
      this.removeDialog = __bind(this.removeDialog, this);
      this.resizeLine = __bind(this.resizeLine, this);
      this.changeLineState = __bind(this.changeLineState, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.className = "line state-closed";

    Line.prototype.defaults = {
      dialog: ".chart-dialog"
    };

    Line.prototype.initialize = function() {
      this.timeline = this.options.timeline;
      this.model.view = this;
      this.model.on("change:previousDialogItem", this.removeDialog);
      this.model.on("change:currentDialogItem", this.changeLineState);
      this.model.on("change:newItemOverlayState", this.newItemOverlayState);
      this.model.on("change:menuItem", this.removeItems);
      this.model.on("remove", this.removeLine);
      this.model.on('change:currentChartHeight', this.resizeLine);
      return this.model.get('items').on("add", this.renderLineItems);
    };

    Line.prototype.template = function() {
      return JST['backbone_app/templates/lineTmpl'];
    };

    Line.prototype.changeLineState = function(line, item) {
      var overlayState, state;
      if (item) {
        overlayState = "charts";
      }
      state = item ? 'open' : 'closed';
      $(this.el).setCssState(state);
      $(this.el).setCssState(overlayState, 'overlay');
      if (item) {
        return this.renderDialog(this.model.currentDialogItem());
      } else {
        return this.model.clearDialogItem();
      }
    };

    Line.prototype.resizeLine = function(line) {
      var height;
      height = line.get('currentChartHeight');
      height = height === '' ? '' : height + App.Timeline.Dimensions.line_height;
      return this.$el.css("height", height);
    };

    Line.prototype.removeDialog = function(item) {
      if (this.model.previousDialogItem() != null) {
        this.model.previousDialogView().remove();
        return this.model.previousDialogItem().set({
          dialogView: null
        });
      }
    };

    Line.prototype.renderDialog = function(item) {
      var dialog;
      dialog = new App.Views.Timeline.ItemDialog({
        line: this.model,
        model: item,
        timeline: this.timeline
      });
      $(this.el).append(dialog.render().el);
      return dialog.renderColumnCharts();
    };

    Line.prototype.renderLineItems = function() {
      this.$(".line-items").empty();
      return _.each(this.model.get('items').models, this.renderLineItem);
    };

    Line.prototype.renderLineItem = function(item) {
      var lineItem;
      lineItem = new App.Views.Timeline.LineItem({
        model: item,
        line: this.model,
        timeline: this.timeline
      });
      return this.$(".line-items").append(lineItem.render().el);
    };

    Line.prototype.newItemOverlayState = function(self, state) {
      var overlayState;
      if (state === 'open') {
        overlayState = "new-item";
      }
      $(this.el).setCssState(state);
      return $(this.el).setCssState(overlayState, 'overlay');
    };

    Line.prototype.renderAddItemOverlay = function() {
      var overlay;
      overlay = new App.Views.Timeline.NewItem({
        model: this.model,
        timeline: this.timeline
      });
      return $(this.el).append(overlay.render().el);
    };

    Line.prototype.removeItems = function() {
      if (this.model.get('menuItem') === null) {
        return this.model.removeItems();
      }
    };

    Line.prototype.removeLine = function() {
      return $(this.el).remove();
    };

    Line.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderAddItemOverlay();
      this.renderLineItems();
      return this;
    };

    return Line;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.MetricsMenuItem = (function(_super) {
    __extends(MetricsMenuItem, _super);

    function MetricsMenuItem() {
      this.deActivate = __bind(this.deActivate, this);
      return MetricsMenuItem.__super__.constructor.apply(this, arguments);
    }

    MetricsMenuItem.prototype.template = 'metricsMenuItemTmpl';

    MetricsMenuItem.prototype.tagName = 'li';

    MetricsMenuItem.prototype.className = function() {
      if (this.model.get('isActive')) {
        return 'active';
      } else {
        return '';
      }
    };

    MetricsMenuItem.prototype.triggers = {
      "click": "activate"
    };

    MetricsMenuItem.prototype.initialize = function() {
      this.on("activate", this.activate);
      return this.listenTo(this.model.collection, "change:isActive", this.deActivate);
    };

    MetricsMenuItem.prototype.activate = function() {
      if (!this.model.get("isActive")) {
        return this.model.set("isActive", true);
      }
    };

    MetricsMenuItem.prototype.deActivate = function(model) {
      if (model.cid !== this.model.cid) {
        return this.model.set("isActive", false, {
          silent: true
        });
      }
    };

    return MetricsMenuItem;

  })(App.Marionette.ItemView);

  App.Views.MetricsMenuList = (function(_super) {
    __extends(MetricsMenuList, _super);

    function MetricsMenuList() {
      return MetricsMenuList.__super__.constructor.apply(this, arguments);
    }

    MetricsMenuList.prototype.itemView = App.Views.MetricsMenuItem;

    MetricsMenuList.prototype.tagName = 'ul';

    MetricsMenuList.prototype.className = 'chart-metrics';

    return MetricsMenuList;

  })(App.Marionette.CollectionView);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.MultistepFormNavigation = (function(_super) {
    __extends(MultistepFormNavigation, _super);

    function MultistepFormNavigation() {
      this.render = __bind(this.render, this);
      this.attributes = __bind(this.attributes, this);
      return MultistepFormNavigation.__super__.constructor.apply(this, arguments);
    }

    MultistepFormNavigation.prototype.tagName = 'ul';

    MultistepFormNavigation.prototype.className = 'wizard-nav';

    MultistepFormNavigation.prototype.template = function() {
      return JST['backbone_app/templates/multistepFormNavigationTmpl'];
    };

    MultistepFormNavigation.prototype.attributes = function() {
      return this.setClass();
    };

    MultistepFormNavigation.prototype.setClass = function(step_no) {
      if (step_no === this.model.currentStepNo()) {
        return "current-step";
      }
    };

    MultistepFormNavigation.prototype.render = function() {
      var opt;
      opt = {};
      _.each(this.model.get('formMetaData').get('stepNames'), (function(item, index) {
        opt.stepNo = index + 1;
        opt.stepName = this.model.i18nStepName(item);
        opt.cssClass = this.setClass(index + 1);
        opt.formModelId = this.model.formModelId();
        return $(this.el).append(this.template()(opt));
      }), this);
      return this;
    };

    return MultistepFormNavigation;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.NewItem = (function(_super) {
    __extends(NewItem, _super);

    function NewItem() {
      this.renderCalendar = __bind(this.renderCalendar, this);
      this.getSelectedRespondent = __bind(this.getSelectedRespondent, this);
      this.saveCallbacks = __bind(this.saveCallbacks, this);
      this.saveItem = __bind(this.saveItem, this);
      this.setIdle = __bind(this.setIdle, this);
      this.close = __bind(this.close, this);
      return NewItem.__super__.constructor.apply(this, arguments);
    }

    NewItem.prototype.className = "line-overlay new-item state-idle";

    NewItem.prototype.events = {
      "click .btn-submit": "saveItem",
      "click .btn-cancel": "close",
      "click span.close": "close"
    };

    NewItem.prototype.selectedDate = null;

    NewItem.prototype.initialize = function() {
      this.timeline = this.options.timeline;
      this.createAndListenToNewItem();
      return this.model.bind("change:newItemOverlayState", this.setIdle);
    };

    NewItem.prototype.template = function() {
      return JST['backbone_app/templates/newItemTmpl'];
    };

    NewItem.prototype.close = function() {
      return this.model.set({
        newItemOverlayState: "closed"
      });
    };

    NewItem.prototype.setIdle = function() {
      if (this.model.get("newItemOverlayState") === "closed") {
        return $(this.el).setCssState("idle");
      }
    };

    NewItem.prototype.createAndListenToNewItem = function() {
      this.newItem = new App.Models.ResponderItem();
      this.listenTo(this.newItem, "change:deadline", this.renderSelectedAlert);
      return this.listenTo(this.newItem, "change:deadline", this.setLineState);
    };

    NewItem.prototype.saveItem = function() {
      var params;
      this.$el.setCssState("sending");
      App.Lib.Spinner.spin(this.$(".state-msg .m-sending")[0]);
      params = {
        subject_id: this.timeline.getSubjectId(),
        survey_id: this.model.get('survey_id'),
        respondent_id: this.getSelectedRespondent()
      };
      this.newItem.set(params);
      return this.newItem.save(this.newItem.attributes, this.saveCallbacks());
    };

    NewItem.prototype.saveCallbacks = function() {
      var callbacks, view;
      view = this;
      return callbacks = {
        success: function(model, response) {
          view.model.addItems(model);
          view.createAndListenToNewItem();
          App.Lib.Spinner.stop();
          return view.$el.setCssState("success");
        },
        error: function(model, xhr) {
          return $(view.el).setCssState("error");
        }
      };
    };

    NewItem.prototype.getSelectedRespondent = function() {
      return _.first(this.timeline.get("subject").get("respondents")).id;
    };

    NewItem.prototype.renderSelectedAlert = function(item, date) {
      if (_.isString(date)) {
        return;
      }
      return this.$(".state-msg .m-selected").html(JST['backbone_app/templates/newItemMsgTmpl']({
        date: item.get('deadline')
      }));
    };

    NewItem.prototype.setLineState = function() {
      return this.$el.setCssState("selected");
    };

    NewItem.prototype.setDeadline = function() {
      var view;
      view = this;
      return function(txt, d) {
        return view.newItem.set('deadline', $.datepicker.parseDate("dd/mm/yy", txt));
      };
    };

    NewItem.prototype.renderCalendar = function() {
      var options;
      options = {
        onSelect: this.setDeadline(),
        minDate: Date.today()
      };
      return this.$('.calendar').datepicker(options);
    };

    NewItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderCalendar();
      return this;
    };

    return NewItem;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.PatientInformationView = (function(_super) {
    __extends(PatientInformationView, _super);

    function PatientInformationView() {
      this.reset = __bind(this.reset, this);
      this.setForm = __bind(this.setForm, this);
      this.insertHtml = __bind(this.insertHtml, this);
      this.renderAvatarUpload = __bind(this.renderAvatarUpload, this);
      this.renderAvatar = __bind(this.renderAvatar, this);
      this.renderCollectionView = __bind(this.renderCollectionView, this);
      this.renderItemView = __bind(this.renderItemView, this);
      return PatientInformationView.__super__.constructor.apply(this, arguments);
    }

    PatientInformationView.prototype.className = "patient-view";

    PatientInformationView.prototype.template = "templates/patientInformationTmpl";

    PatientInformationView.prototype.onRender = function() {
      this.renderItemView(new App.Models.Person(this.options.subject), ".subject .information");
      return this.renderCollectionView(new App.Collections.Person(this.options.parents), ".parents");
    };

    PatientInformationView.prototype.renderItemView = function(model, container) {
      var subjectView;
      subjectView = new App.Views.EditableItem({
        model: model
      });
      subjectView.on("itemEdit", this.setForm);
      this.insertHtml(subjectView, container);
      this.renderAvatar(".subject .avatar", this.options.subject);
      return this.renderAvatarUpload(".subject .upload", this.options.subject.id);
    };

    PatientInformationView.prototype.renderCollectionView = function(collection, container) {
      var parentsView, person, _i, _len, _ref, _results;
      parentsView = new App.Views.EditableItemCollection({
        collection: collection
      });
      parentsView.on("itemview:itemEdit", this.setForm);
      this.insertHtml(parentsView, container);
      _ref = collection.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        person = _ref[_i];
        _results.push(this.renderAvatarUpload(container, person.id));
      }
      return _results;
    };

    PatientInformationView.prototype.renderAvatar = function(container, person) {
      var avatar, html;
      avatar = person.avatar;
      html = '<img src="' + avatar + '" ><a href="#" onclick="$(\'.avatarUploadModal_' + person.id + '\').toggle();return false;"><span class="btn btn-mini dialog"><i class="icon-upload"></i></span></a>';
      return this.$(container).html(html);
    };

    PatientInformationView.prototype.renderAvatarUpload = function(container, id) {
      var form, token;
      token = $("meta[name=\"csrf-token\"]").attr("content");
      form = this.$('form', container);
      return form.find('.authenticity_token').val(token);
    };

    PatientInformationView.prototype.insertHtml = function(view, container) {
      if (_.isString(container)) {
        return this.$(container).html(view.render().el);
      } else {
        return container.replaceWith(view.render().el);
      }
    };

    PatientInformationView.prototype.setForm = function(editableItem) {
      var form;
      form = editableItem.renderForm();
      form.on("destroy", this.reset);
      editableItem.$el.replaceWith(form.el);
      return editableItem.close();
    };

    PatientInformationView.prototype.reset = function(formView) {
      this.renderItemView(formView.model, formView.$el);
      return formView.close();
    };

    return PatientInformationView;

  })(Backbone.Marionette.ItemView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.QuestionResponseItem = (function(_super) {
    __extends(QuestionResponseItem, _super);

    function QuestionResponseItem() {
      return QuestionResponseItem.__super__.constructor.apply(this, arguments);
    }

    QuestionResponseItem.prototype.template = 'templates/questionResponseItemTmpl';

    QuestionResponseItem.prototype.tagName = 'tr';

    QuestionResponseItem.prototype.className = function() {
      return "answer-level-" + (this.model.get('answer'));
    };

    return QuestionResponseItem;

  })(Backbone.Marionette.ItemView);

  App.Views.QuestionResponseList = (function(_super) {
    __extends(QuestionResponseList, _super);

    function QuestionResponseList() {
      return QuestionResponseList.__super__.constructor.apply(this, arguments);
    }

    QuestionResponseList.prototype.template = 'templates/questionResponseListTmpl';

    QuestionResponseList.prototype.itemView = App.Views.QuestionResponseItem;

    QuestionResponseList.prototype.itemViewContainer = 'tbody';

    QuestionResponseList.prototype.tagName = 'table';

    QuestionResponseList.prototype.className = 'question-list';

    QuestionResponseList.prototype.initialize = function() {
      var params;
      params = {
        questionGroupName: this.collection.questionGroupName,
        surveyAccessCode: this.collection.surveyAccessCode()
      };
      return this.model = new Backbone.Model(params);
    };

    QuestionResponseList.prototype.adjustTable = function() {
      this.marginTop();
      return App.Event.trigger("chartHeight", this.collection.tableHeight(this.$el.height()));
    };

    QuestionResponseList.prototype.marginTop = function() {
      var margin;
      margin = this.collection.placement(this.$el.height());
      return this.$el.css('marginTop', "" + margin + "px");
    };

    QuestionResponseList.prototype.adjust = function() {
      this.$el.tableSort();
      return this.adjustTable();
    };

    return QuestionResponseList;

  })(Backbone.Marionette.CompositeView);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.SimpleForm = (function(_super) {
    __extends(SimpleForm, _super);

    function SimpleForm() {
      this.destroyForm = __bind(this.destroyForm, this);
      this.container = __bind(this.container, this);
      this.triggerDestroy = __bind(this.triggerDestroy, this);
      this.submitForm = __bind(this.submitForm, this);
      this.validateForm = __bind(this.validateForm, this);
      return SimpleForm.__super__.constructor.apply(this, arguments);
    }

    SimpleForm.prototype.className = "simple-form editable-item";

    SimpleForm.prototype.template = "simpleFormTmpl";

    SimpleForm.prototype.events = {
      "click .btn-submit": "validateForm",
      "click .btn-cancel": "destroyForm"
    };

    SimpleForm.prototype.onRender = function() {
      this.form = new Backbone.Form({
        model: this.model
      }).render();
      this.$el.prepend(this.form.el);
      return this.form.$el.addClass('form-horizontal');
    };

    SimpleForm.prototype.validateForm = function() {
      var errors;
      errors = this.form.commit();
      if (_.isEmpty(errors)) {
        return this.submitForm();
      }
    };

    SimpleForm.prototype.submitForm = function() {
      var callbacks, view;
      view = this;
      callbacks = {
        success: function(model, response) {
          return view.destroyForm();
        },
        error: function(model, xhr) {
          throw I18n.t("marionette.errors.model_not_saved", {
            model: model
          });
        }
      };
      return this.model.save(this.model.attributes, callbacks);
    };

    SimpleForm.prototype.triggerDestroy = function(model, response) {
      var paramRoot;
      return paramRoot = this.model.paramRoot;
    };

    SimpleForm.prototype.container = function() {
      return this.$el.parent();
    };

    SimpleForm.prototype.destroyForm = function() {
      return this.trigger("destroy", this);
    };

    return SimpleForm;

  })(Backbone.Marionette.ItemView);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).SurveyMenuItem || (_base.SurveyMenuItem = {});

  App.Views.SurveyMenuItem = (function(_super) {
    __extends(SurveyMenuItem, _super);

    function SurveyMenuItem() {
      this.render = __bind(this.render, this);
      this.setInput = __bind(this.setInput, this);
      this.setVisibility = __bind(this.setVisibility, this);
      this.switchVisibility = __bind(this.switchVisibility, this);
      return SurveyMenuItem.__super__.constructor.apply(this, arguments);
    }

    SurveyMenuItem.prototype.tagName = "li";

    SurveyMenuItem.prototype.className = 'state-hidden';

    SurveyMenuItem.prototype.events = {
      "click": "setVisibility"
    };

    SurveyMenuItem.prototype.initialize = function() {
      this.model.view = this;
      return this.model.bind("change:visibility", this.switchVisibility);
    };

    SurveyMenuItem.prototype.template = function() {
      return JST['backbone_app/templates/surveyMenuItemTmpl'];
    };

    SurveyMenuItem.prototype.switchVisibility = function(model, value) {
      this.setInput(value);
      return $(this.el).setCssState(value);
    };

    SurveyMenuItem.prototype.setVisibility = function() {
      if ($(this.el).cssState() === 'visible') {
        return this.model.hideLine();
      } else {
        return this.model.addLine();
      }
    };

    SurveyMenuItem.prototype.setInput = function(state) {
      if (state === 'visible') {
        return this.$("input").prop("checked", true);
      }
    };

    SurveyMenuItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return SurveyMenuItem;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).SurveyMenu || (_base.SurveyMenu = {});

  App.Views.SurveyMenu = (function(_super) {
    __extends(SurveyMenu, _super);

    function SurveyMenu() {
      this.render = __bind(this.render, this);
      this.renderMenuItems = __bind(this.renderMenuItems, this);
      this.setToVisible = __bind(this.setToVisible, this);
      this.renderItem = __bind(this.renderItem, this);
      return SurveyMenu.__super__.constructor.apply(this, arguments);
    }

    SurveyMenu.prototype.id = "survey-menu";

    SurveyMenu.prototype["class"] = 'dropdown';

    SurveyMenu.prototype.initialize = function() {
      this.lines = this.options.lines;
      this.timeline = this.options.timeline;
      this.surveys = this.timeline.fillSurveyMenu();
      return this.lines.bind("add", this.setToVisible);
    };

    SurveyMenu.prototype.template = function() {
      return JST['backbone_app/templates/surveyMenuTmpl'];
    };

    SurveyMenu.prototype.renderItem = function(item) {
      var menuItem;
      item.set({
        lines: this.lines
      });
      menuItem = new App.Views.SurveyMenuItem({
        model: item,
        timeline: this.timeline
      });
      return this.$("ul").prepend(menuItem.render().el);
    };

    SurveyMenu.prototype.setToVisible = function(line) {
      var menuItem;
      if (this.popover) {
        this.popover.popover('destroy');
      }
      this.$el.removeClass("state-empty-instructions");
      menuItem = this.surveys.get(line.get("survey_id"));
      return menuItem.showLine(line);
    };

    SurveyMenu.prototype.showEmptyInstructions = function() {
      if (this.timeline.get('lines').size() === 0) {
        this.$el.setCssState("empty-instructions");
        return this.popover = this.$('a.popover-target').popover('show');
      }
    };

    SurveyMenu.prototype.renderMenuItems = function() {
      return _.each(this.surveys.models, this.renderItem);
    };

    SurveyMenu.prototype.render = function() {
      $(this.el).html(this.template()({}));
      this.showEmptyInstructions();
      return this;
    };

    return SurveyMenu;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.Nav = (function(_super) {
    __extends(Nav, _super);

    function Nav() {
      this.render = __bind(this.render, this);
      return Nav.__super__.constructor.apply(this, arguments);
    }

    Nav.prototype.tagName = "nav";

    Nav.prototype.events = {
      "click li:nth-child(1)": "forward",
      "click li:nth-child(2)": "backward"
    };

    Nav.prototype.forward = function() {
      return this.model.step(-6);
    };

    Nav.prototype.backward = function() {
      return this.model.step(6);
    };

    Nav.prototype.template = function() {
      return JST['backbone_app/templates/timelineNavTmpl'];
    };

    Nav.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return Nav;

  })(Backbone.View);

}).call(this);
(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.Canvas = (function(_super) {
    __extends(Canvas, _super);

    function Canvas() {
      this.render = __bind(this.render, this);
      this.filterBySurveyId = __bind(this.filterBySurveyId, this);
      this.createSortedLinesCollection = __bind(this.createSortedLinesCollection, this);
      this.goToDate = __bind(this.goToDate, this);
      this.move = __bind(this.move, this);
      this.renderHeadingsList = __bind(this.renderHeadingsList, this);
      this.renderSurveyMenu = __bind(this.renderSurveyMenu, this);
      this.renderNavigation = __bind(this.renderNavigation, this);
      this.appendLine = __bind(this.appendLine, this);
      this.focusNewItem = __bind(this.focusNewItem, this);
      this.updateOpenLine = __bind(this.updateOpenLine, this);
      return Canvas.__super__.constructor.apply(this, arguments);
    }

    Canvas.prototype.id = "canvas";

    Canvas.prototype.initialize = function() {
      this.model.set({
        items: this.collection
      });
      this.model.view = this;
      this.lines = this.model.get('lines');
      this.surveyMenu = this.model.get('surveyMenu');
      this.lines.bind("change:currentDialogItem", this.updateOpenLine);
      this.lines.bind("change:newItemOverlayState", this.focusNewItem);
      this.model.bind("change:current_position", this.move);
      this.model.bind("change:current_date", this.goToDate);
      return this.lines.bind("add", this.appendLine);
    };

    Canvas.prototype.template = function() {
      return JST["backbone_app/templates/timelineTmpl"];
    };

    Canvas.prototype.updateOpenLine = function(line, item) {
      var state;
      if (item) {
        state = 'open';
      }
      return this.focusNewItem(null, state);
    };

    Canvas.prototype.focusNewItem = function(obj, value) {
      var state;
      state = value === "open" ? "new-item" : "";
      return $(this.el).setCssState(state);
    };

    Canvas.prototype.appendLine = function(line) {
      var lineView;
      this.$el.setCssState('');
      lineView = new App.Views.Timeline.Line({
        model: line,
        timeline: this.model
      });
      return this.$("#tml-history").append(lineView.render().el);
    };

    Canvas.prototype.renderNavigation = function() {
      var timelineNav;
      timelineNav = new App.Views.Timeline.Nav({
        model: this.model
      });
      return $(this.el).prepend(timelineNav.render().el);
    };

    Canvas.prototype.renderSurveyMenu = function() {
      var surveyMenuView;
      surveyMenuView = new App.Views.SurveyMenu({
        lines: this.lines,
        timeline: this.model
      });
      this.$el.prepend(surveyMenuView.render().el);
      return surveyMenuView.renderMenuItems();
    };

    Canvas.prototype.renderHeadingsList = function() {
      var headingsList;
      headingsList = new App.Views.Timeline.HeadingsList({
        lines: this.lines,
        timeline: this.model
      }).render().el;
      this.model.set({
        headingsList: headingsList
      });
      return this.$('#tml-body').append(headingsList);
    };

    Canvas.prototype.move = function() {
      return this.$("#tml-history").css({
        "margin-left": this.model.get("current_position")
      });
    };

    Canvas.prototype.goToDate = function() {
      return this.model.goToDate();
    };

    Canvas.prototype.createSortedLinesCollection = function() {
      var ids, that;
      that = this;
      ids = _.uniq(this.collection.pluck('survey_id'));
      return _.map(ids, function(id) {
        var models, params;
        models = that.filterBySurveyId(id);
        params = {
          survey_id: id,
          items: new App.Collections.ResponderItemsCollection(models),
          name: that.model.getSurveyAccessCode(id),
          timeline: that.model
        };
        return new App.Models.Line(params);
      });
    };

    Canvas.prototype.filterBySurveyId = function(id) {
      return this.collection.filter(function(item) {
        if (item.get("survey_id") === id) {
          return item;
        }
      });
    };

    Canvas.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderNavigation();
      this.renderSurveyMenu();
      this.renderHeadingsList();
      this.lines.add(this.createSortedLinesCollection());
      this.model.set({
        current_date: Date.today()
      });
      return this;
    };

    return Canvas;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.useragentDetectionView = (function(_super) {
    __extends(useragentDetectionView, _super);

    function useragentDetectionView() {
      return useragentDetectionView.__super__.constructor.apply(this, arguments);
    }

    useragentDetectionView.prototype.className = "useragent-detection";

    useragentDetectionView.prototype.initialize = function() {
      return this.browser = this.options.browser;
    };

    useragentDetectionView.prototype.template = function() {
      return JST['backbone_app/templates/useragentDetectionTmpl'];
    };

    useragentDetectionView.prototype.render = function() {
      $(this.el).html(this.template()(this.browser));
      return this;
    };

    return useragentDetectionView;

  })(Backbone.View);

}).call(this);