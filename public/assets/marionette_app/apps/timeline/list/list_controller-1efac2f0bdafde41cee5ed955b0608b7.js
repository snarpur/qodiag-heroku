(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("TimelineApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.showMenu = __bind(this.showMenu, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(id, options) {
        this.subjectId = id;
        this.showSubjectNavigation(id);
        return this.getItems();
      };

      Controller.prototype.getItems = function() {
        this.items = App.request("get:person:responder:items", {
          personId: this.subjectId,
          concern: 'subject'
        });
        this.visItems = new vis.DataSet();
        this.initialSurveys = [];
        return App.execute("when:fetched", this.items, (function(_this) {
          return function() {
            _this.items.each(function(model) {
              if (model.get("survey_id") != null) {
                _this.visItems.add(_this.buildItem(model));
                return _this.initialSurveys.push(model.get("survey_id"));
              }
            });
            _this.showContent({
              items: _this.items,
              visItems: _this.visItems
            });
            return _this.listenTo(_this.items, "add", function(model, collection) {
              return this.visItems.add(this.buildItem(model));
            });
          };
        })(this));
      };

      Controller.prototype.buildItem = function(responderItem) {
        var params, start, _ref;
        start = new Date((_ref = responderItem.get("completed")) != null ? _ref : responderItem.get("deadline"));
        start = moment(start).minutes(0).seconds(0).milliseconds(0);
        params = {
          id: "" + (responderItem.get('id')),
          surveyId: responderItem.get('survey_id'),
          type: 'point',
          className: this.getItemClassName(responderItem)
        };
        params.start = start;
        params.content = responderItem.get("survey") != null ? responderItem.get("survey").access_code : this.surveys.get(responderItem.get('survey_id')).get("access_code");
        return params;
      };

      Controller.prototype.getItemClassName = function(model) {
        if (this.isCompleted(model)) {
          return "completed";
        } else if (this.isPending(model)) {
          return "pending";
        } else if (this.isOverdue(model)) {
          return "overdue";
        }
      };

      Controller.prototype.deadlineIsPassed = function(model) {
        var deadline;
        deadline = Date.parse(model.get('deadline'));
        return deadline.isBefore(Date.today());
      };

      Controller.prototype.isCompleted = function(model) {
        return model.get('completed') != null;
      };

      Controller.prototype.isOverdue = function(model) {
        return !this.isPending(model) && !this.isCompleted(model);
      };

      Controller.prototype.isPending = function(model) {
        return !this.isCompleted(model) && !this.deadlineIsPassed(model);
      };

      Controller.prototype.showSubjectNavigation = function(subjectId) {
        this.person = App.request("get:person:entity", subjectId);
        return App.execute("when:fetched", this.person, (function(_this) {
          return function() {
            return App.execute("show:subject:navigation", {
              person: _this.person,
              personId: subjectId,
              currentItemName: 'timeline'
            });
          };
        })(this));
      };

      Controller.prototype.showContent = function(options) {
        this.listenTo(this.getLayout(), "show", (function(_this) {
          return function() {
            _this.showTimeline(options);
            return _this.showMenu();
          };
        })(this));
        this.listenTo(this.getLayout(), "add:survey:clicked", (function(_this) {
          return function() {
            return _this.createSurvey({
              itemCollection: _this.items
            });
          };
        })(this));
        return App.contentRegion.show(this.getLayout());
      };

      Controller.prototype.showMenu = function() {
        this.surveys = App.request("get:surveys");
        return App.execute("when:fetched", this.surveys, (function(_this) {
          return function() {
            if (_this.menuView == null) {
              _this.menuView = new List.Select({
                model: new Backbone.Model(),
                items: _this.items,
                collection: _this.surveys,
                initialSurveys: _.uniq(_this.initialSurveys)
              });
            }
            _this.show(_this.menuView, {
              region: _this.getLayout().menuRegion
            });
            return _this.listenTo(_this.menuView, "select:menu:changed", function(options) {
              if (options.removed != null) {
                return _this.hideSurvey(options.removed.id);
              } else {
                return _this.showSurvey(options.added.id);
              }
            });
          };
        })(this));
      };

      Controller.prototype.showSurvey = function(surveyId) {
        return this.items.each((function(_this) {
          return function(model) {
            if (model.get("survey_id") === surveyId) {
              return _this.visItems.add(_this.buildItem(model));
            }
          };
        })(this));
      };

      Controller.prototype.hideSurvey = function(surveyId) {
        var itemIds;
        itemIds = this.visItems.get({
          fields: ["id"],
          filter: (function(_this) {
            return function(item) {
              return item.surveyId === surveyId;
            };
          })(this)
        });
        return this.visItems.remove(_.pluck(itemIds, "id"));
      };

      Controller.prototype.getTimeline = function(model) {
        return this.timelineView != null ? this.timelineView : this.timelineView = new List.Timeline({
          model: model
        });
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout();
      };

      Controller.prototype.showTimeline = function(options) {
        var visModel;
        visModel = new Backbone.Model(options);
        this.show(this.getTimeline(visModel), {
          region: this.getLayout().timelineRegion
        });
        return this.listenTo(this.getTimeline(), "item:selected", (function(_this) {
          return function(options) {
            if (options.item.get("completed") != null) {
              return _this.getColumnCharts(options);
            }
          };
        })(this));
      };

      Controller.prototype.createSurvey = function(options) {
        if (options == null) {
          options = {};
        }
        return App.request("create:survey:view", options);
      };

      Controller.prototype.chartsLayout = function(options) {
        if (options == null) {
          options = {};
        }
        return new App.Components.Charts.ChartLayout(options);
      };

      Controller.prototype.chartsView = function(options) {
        return new App.Components.Charts.ColumnCharts(options);
      };

      Controller.prototype.onChangeChart = function(layout) {
        return this.listenTo(layout, "active:chart:selected", (function(_this) {
          return function(view) {
            _this.charts.setCurrentMetric(view.model.get("name"));
            return _this.updateChart();
          };
        })(this));
      };

      Controller.prototype.onChangeFilter = function(layout) {
        return this.listenTo(layout, "filter:changed", (function(_this) {
          return function(view, normReference) {
            _this.charts.setNormReferenceId(normReference.id);
            return _this.updateChart();
          };
        })(this));
      };

      Controller.prototype.updateChart = function() {
        return this.charts.fetch({
          reset: true
        });
      };

      Controller.prototype.getColumnCharts = function(options) {
        var chartsLayout;
        chartsLayout = this.chartsLayout();
        App.dialogRegion.show(chartsLayout);
        this.charts = App.request("column:charts", options);
        return App.execute("when:fetched", this.charts, (function(_this) {
          return function() {
            var chartView;
            chartView = _this.chartsView({
              collection: _this.charts
            });
            _this.onChangeChart(chartsLayout);
            _this.onChangeFilter(chartsLayout);
            return chartsLayout.chartsRegion.show(chartView);
          };
        })(this));
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
