(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Lib).ChartEvents || (_base.ChartEvents = {});

  App.Lib.ChartEvents.Drilldown = (function(_super) {
    __extends(Drilldown, _super);

    function Drilldown() {
      this.addChartToHistory = __bind(this.addChartToHistory, this);
      this.addQuestionListToHistory = __bind(this.addQuestionListToHistory, this);
      this.mergeParamsFromRoot = __bind(this.mergeParamsFromRoot, this);
      this.getQuestionList = __bind(this.getQuestionList, this);
      this.drilldown = __bind(this.drilldown, this);
      this.drillup = __bind(this.drillup, this);
      return Drilldown.__super__.constructor.apply(this, arguments);
    }

    Drilldown.prototype.initialize = function() {
      this.chart = this.get('chart');
      this.set("paramsHistory", [this.chart.attributes]);
      this.chart.get('plotOptions').column.cursor = 'pointer';
      return this.chart.get('plotOptions').column.point.events.click = this.drilldown;
    };

    Drilldown.prototype.drillup = function() {
      var paramsHistory;
      paramsHistory = _.initial(this.get('paramsHistory'));
      return this.set("paramsHistory", paramsHistory);
    };

    Drilldown.prototype.getCurrentChartParams = function() {
      return _.last(this.get("paramsHistory"));
    };

    Drilldown.prototype.drilldown = function(event) {
      var drilldown, target;
      target = event.currentTarget;
      if (target.drilldown) {
        this.set({
          previousChart: target.series.chart
        });
        drilldown = $.extend(true, {}, target.drilldown);
        return this.addChartToHistory(drilldown);
      } else if (this.isQuestionList(target.category)) {
        return this.getQuestionList(target.category);
      }
    };

    Drilldown.prototype.getQuestionList = function(questionGroupName) {
      var callbacks, drilldown, questionList;
      questionList = new App.Collections.QuestionResponse(questionGroupName, this.chart);
      drilldown = this;
      callbacks = {
        success: function(model, response) {
          return drilldown.addQuestionListToHistory(questionList);
        },
        error: function(model, response) {
          throw I18n.t("surveys.messages.question_list_failed", {
            name: questionGroupName
          });
        }
      };
      return questionList.fetch(callbacks);
    };

    Drilldown.prototype.mergeParamsFromRoot = function(params) {
      var inherited;
      inherited = ["chart", "credits", "legend", "subtitle", "title", "tooltip", "yAxis", "xAxis", "plotOptions"];
      _.each(inherited, (function(i) {
        var target;
        target = params[i];
        if (target == null) {
          target = {};
        }
        return params[i] = $.extend({}, this.chart.get(i), target);
      }), this);
      params.chart.width = App.Timeline.Dimensions.history_view_width;
      return params;
    };

    Drilldown.prototype.isQuestionList = function(category) {
      return _.contains(this.chart.get('questionListDrilldown'), category);
    };

    Drilldown.prototype.addQuestionListToHistory = function(questionResponse) {
      var paramsHistory;
      paramsHistory = this.get("paramsHistory");
      paramsHistory.push(questionResponse);
      this.set('paramsHistory', paramsHistory);
      return this.trigger('change:paramsHistory');
    };

    Drilldown.prototype.addChartToHistory = function(params) {
      var paramsHistory;
      params = this.mergeParamsFromRoot(params);
      paramsHistory = this.get("paramsHistory");
      paramsHistory.push(params);
      this.set('paramsHistory', paramsHistory);
      return this.trigger('change:paramsHistory');
    };

    return Drilldown;

  })(Backbone.Model);

}).call(this);
