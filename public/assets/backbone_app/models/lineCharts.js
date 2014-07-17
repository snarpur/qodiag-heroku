(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.LineChart = (function(_super) {
    __extends(LineChart, _super);

    function LineChart() {
      this.setContainerName = __bind(this.setContainerName, this);
      this.addParametersToUrl = __bind(this.addParametersToUrl, this);
      this.respondentUrlSegment = __bind(this.respondentUrlSegment, this);
      this.surveyUrlSegment = __bind(this.surveyUrlSegment, this);
      return LineChart.__super__.constructor.apply(this, arguments);
    }

    LineChart.prototype.initialize = function() {
      this.item = this.get('item');
      this.urlRoot = "/people/:subject_id/responder_items/responses/";
      this.url = function() {
        var base;
        base = this.urlRoot.replace(/:subject_id/, this.item.get('subject_id'));
        return "" + base + (_.endsWith(base, '/') ? '' : void 0) + (this.addParametersToUrl());
      };
      return this.bind("change:charts", this.setContainerName);
    };

    LineChart.prototype.surveyUrlSegment = function() {
      return encodeURIComponent(this.item.get('survey_id'));
    };

    LineChart.prototype.respondentUrlSegment = function() {
      return encodeURIComponent(this.item.get('respondent_id'));
    };

    LineChart.prototype.addParametersToUrl = function() {
      return "" + (this.respondentUrlSegment()) + "/" + (this.surveyUrlSegment());
    };

    LineChart.prototype.setContainerName = function() {
      if (this.get("charts") != null) {
        return _.each(this.get("charts"), function(c) {
          return c.chart.renderTo = "line-" + c.chart.renderTo;
        });
      }
    };

    return LineChart;

  })(Backbone.Model);

}).call(this);
