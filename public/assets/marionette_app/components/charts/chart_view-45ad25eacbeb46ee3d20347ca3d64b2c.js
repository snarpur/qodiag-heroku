(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("Components.Charts", function(Charts, App, Backbone, Marionette, $, _) {
    Charts.ChartLayout = (function(_super) {
      __extends(ChartLayout, _super);

      function ChartLayout() {
        return ChartLayout.__super__.constructor.apply(this, arguments);
      }

      ChartLayout.prototype.template = "charts/templates/chart_layout";

      ChartLayout.prototype.regions = {
        chartsRegion: "#charts-region",
        chartsHeadingRegion: "#charts-heading-region",
        chartsMenuRegion: "#charts-menu-region",
        chartsFilterRegion: "#charts-filter-region"
      };

      ChartLayout.prototype.onShow = function() {
        return this.chartsRegion.on("show", (function(_this) {
          return function(chartView) {
            var filter, menu;
            menu = new Charts.ChartsMenu({
              collection: chartView.collection.getChartMenu()
            });
            filter = new Charts.ChartsFilters({
              collection: chartView.collection.getChartFilter()
            });
            filter.chart;
            _this.setHeading(chartView);
            _this.listenTo(chartView.collection, "charts:rendered", function(view) {
              return this.setHeading(view);
            });
            _this.listenTo(menu, "childview:active", function(options) {
              return _this.trigger("active:chart:selected", options);
            });
            _this.listenTo(filter, "childview:selected", function(options, normReference) {
              return _this.trigger("filter:changed", options, normReference);
            });
            _this.chartsMenuRegion.show(menu);
            return _this.chartsFilterRegion.show(filter);
          };
        })(this));
      };

      ChartLayout.prototype.setHeading = function(chartsView) {
        var heading;
        heading = chartsView.groupTitle();
        $(this.chartsHeadingRegion.el).find(".modal-title").remove();
        return $(this.chartsHeadingRegion.el).append("<h4 class='modal-title'>" + heading + "</h4>");
      };

      return ChartLayout;

    })(App.Views.Layout);
    Charts.ColumnChart = (function(_super) {
      __extends(ColumnChart, _super);

      function ColumnChart() {
        this.drillup = __bind(this.drillup, this);
        this.attributes = __bind(this.attributes, this);
        return ColumnChart.__super__.constructor.apply(this, arguments);
      }

      ColumnChart.prototype.template = "charts/templates/_column";

      ColumnChart.prototype.id = function() {
        return "chart-" + this.options.index;
      };

      ColumnChart.prototype.attributes = function() {
        return {
          style: (function(_this) {
            return function() {
              return "float: left; width: " + (_this.model.chartWidth() * 90) + "%;";
            };
          })(this)
        };
      };

      ColumnChart.prototype.ui = {
        chart: ".chart",
        drillup: ".drillup"
      };

      ColumnChart.prototype.events = {
        "click .drillup": "drillup"
      };

      ColumnChart.prototype.modelEvents = {
        "change:drilldownHistory": "updateChart"
      };

      ColumnChart.prototype.initialize = function() {
        this.chartSetUp(this.model.get("chartOptions"));
        return ColumnChart.__super__.initialize.apply(this, arguments);
      };

      ColumnChart.prototype.onShow = function() {
        return this.createChart(this.model.get("chartOptions"));
      };

      ColumnChart.prototype.updateChart = function(options) {
        this.createChart(options.config);
        return this.triggerMethod("chart:updated");
      };

      ColumnChart.prototype.createChart = function(config) {
        return this.currentChart = new Highcharts.Chart(config);
      };

      ColumnChart.prototype.drilldown = function(e) {
        return this.options.chart.appView().triggerMethod("drilldown", {
          e: e,
          chart: this
        });
      };

      ColumnChart.prototype.drillup = function() {
        return this.model.back();
      };

      ColumnChart.prototype.toggleDrillupButton = function() {
        var state;
        state = this.model.isChartRoot() ? 'hidden' : 'visible';
        return this.ui.drillup.css('visibility', state);
      };

      ColumnChart.prototype.onChartUpdated = function() {
        return this.toggleDrillupButton();
      };

      ColumnChart.prototype.onDrilldown = function(options) {
        var drilldownChart;
        drilldownChart = this.model.get("drilldownSeries")[options.e.point.name];
        return this.model.addChartToHistory(drilldownChart);
      };

      ColumnChart.prototype.setFormatters = function(config) {
        var formatter;
        formatter = new Charts.Formatter.Column(config);
        return formatter.setFormatters();
      };

      ColumnChart.prototype.setDrilldown = function(config) {
        var appView;
        appView = this;
        return config.chart.appView = function() {
          return appView;
        };
      };

      ColumnChart.prototype.setAppView = function(config) {
        return config.chart.events.drilldown = this.drilldown;
      };

      ColumnChart.prototype.setContainer = function(config) {
        return config.chart.renderTo = this.ui.chart[0];
      };

      ColumnChart.prototype.chartSetUp = function(config) {
        this.setDrilldown(config);
        this.setAppView(config);
        return this.setFormatters(config);
      };

      return ColumnChart;

    })(App.Views.ItemView);
    Charts.ColumnCharts = (function(_super) {
      __extends(ColumnCharts, _super);

      function ColumnCharts() {
        this.subtitle = __bind(this.subtitle, this);
        this.groupTitle = __bind(this.groupTitle, this);
        return ColumnCharts.__super__.constructor.apply(this, arguments);
      }

      ColumnCharts.prototype.itemView = Charts.ColumnChart;

      ColumnCharts.prototype.className = 'row';

      ColumnCharts.prototype.onRender = function() {
        return this.collection.trigger("charts:rendered", this);
      };

      ColumnCharts.prototype.groupTitle = function() {
        var title;
        title = _.chain(this.collection.options.groupTitle).map((function(i) {
          return this["title" + (_(i[0]).capitalize())].call(this, i[1]);
        }), this).flatten().value();
        return "" + (title.join(' ')) + " | " + (this.subtitle());
      };

      ColumnCharts.prototype.titleSurvey = function(name) {
        return _(I18n.t("surveys." + name + ".name")).capitalize();
      };

      ColumnCharts.prototype.titleSex = function(sex) {
        return I18n.t("surveys.terms." + sex);
      };

      ColumnCharts.prototype.titleAge = function(age) {
        var str;
        str = "" + age + " ";
        return str.concat(I18n.t("surveys.terms.age"));
      };

      ColumnCharts.prototype.titleRespondent = function(respondent) {
        return I18n.t("surveys.terms.norm_reference." + respondent);
      };

      ColumnCharts.prototype.subtitle = function() {
        if (this.collection.options.completed != null) {
          return "<small class='white'><em>" + (I18n.l('date.formats.long', this.collection.options.completed)) + "</em></small>";
        } else {
          return "";
        }
      };

      return ColumnCharts;

    })(App.Views.CollectionView);
    Charts.ChartsMenuItem = (function(_super) {
      __extends(ChartsMenuItem, _super);

      function ChartsMenuItem() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return ChartsMenuItem.__super__.constructor.apply(this, arguments);
      }

      ChartsMenuItem.prototype.template = 'charts/templates/_charts_menu_item';

      ChartsMenuItem.prototype.className = 'btn-group';

      ChartsMenuItem.prototype.events = {
        "click": "active"
      };

      ChartsMenuItem.prototype.templateHelpers = function() {
        return {
          activeChart: (function(_this) {
            return function() {
              var btn;
              btn = ['btn btn-info active', 'btn btn-white'];
              if (_this.options.index === 0) {
                return btn[0];
              } else {
                return btn[1];
              }
            };
          })(this)
        };
      };

      ChartsMenuItem.prototype.initialize = function() {
        this.listenTo(this.options.collectionView, "childview:active", (function(_this) {
          return function(view) {
            return _this.removeClass(view);
          };
        })(this));
        return ChartsMenuItem.__super__.initialize.apply(this, arguments);
      };

      ChartsMenuItem.prototype.ui = {
        'nav': 'button'
      };

      ChartsMenuItem.prototype.removeClass = function(view) {
        if (view.options.index !== this.options.index && this.ui.nav.hasClass('active')) {
          this.ui.nav.removeClass('active btn-info');
          return this.ui.nav.addClass('btn-white');
        }
      };

      ChartsMenuItem.prototype.active = function() {
        if (!this.ui.nav.hasClass('active')) {
          this.ui.nav.removeClass('btn-white');
          this.ui.nav.addClass('active btn-info');
          return this.triggerMethod("active");
        }
      };

      return ChartsMenuItem;

    })(App.Views.ItemView);
    Charts.ChartsMenu = (function(_super) {
      __extends(ChartsMenu, _super);

      function ChartsMenu() {
        this.childViewOptions = __bind(this.childViewOptions, this);
        return ChartsMenu.__super__.constructor.apply(this, arguments);
      }

      ChartsMenu.prototype.itemView = Charts.ChartsMenuItem;

      ChartsMenu.prototype.className = 'btn-group btn-group-justified';

      ChartsMenu.prototype.childViewOptions = function() {
        return {
          collectionView: this
        };
      };

      ChartsMenu.prototype.initialize = function() {
        if (this.activeIndex == null) {
          this.activeIndex = 0;
        }
        return ChartsMenu.__super__.initialize.apply(this, arguments);
      };

      return ChartsMenu;

    })(App.Views.CollectionView);
    Charts.ChartsFilter = (function(_super) {
      __extends(ChartsFilter, _super);

      function ChartsFilter() {
        return ChartsFilter.__super__.constructor.apply(this, arguments);
      }

      ChartsFilter.prototype.template = 'charts/templates/_charts_filters';

      ChartsFilter.prototype.events = {
        "change select": "normReferenceChanged"
      };

      ChartsFilter.prototype.normReferenceChanged = function(event) {
        return this.triggerMethod("selected", {
          id: event.currentTarget.value
        });
      };

      return ChartsFilter;

    })(App.Views.ItemView);
    return Charts.ChartsFilters = (function(_super) {
      __extends(ChartsFilters, _super);

      function ChartsFilters() {
        return ChartsFilters.__super__.constructor.apply(this, arguments);
      }

      ChartsFilters.prototype.itemView = Charts.ChartsFilter;

      ChartsFilters.prototype.className = 'form-group';

      return ChartsFilters;

    })(App.Views.CollectionView);
  });

}).call(this);
