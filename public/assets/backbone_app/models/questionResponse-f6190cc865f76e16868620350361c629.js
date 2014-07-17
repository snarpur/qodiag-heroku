(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App.Models.QuestionResponse = (function(_super) {
    __extends(QuestionResponse, _super);

    function QuestionResponse() {
      return QuestionResponse.__super__.constructor.apply(this, arguments);
    }

    QuestionResponse.prototype.initialize = function() {
      return this.set('surveyAccessCode', this.collection.surveyAccessCode());
    };

    return QuestionResponse;

  })(Backbone.Model);

  App.Collections.QuestionResponse = (function(_super) {
    __extends(QuestionResponse, _super);

    function QuestionResponse() {
      this.surveyAccessCode = __bind(this.surveyAccessCode, this);
      return QuestionResponse.__super__.constructor.apply(this, arguments);
    }

    QuestionResponse.prototype.model = App.Models.QuestionResponse;

    QuestionResponse.prototype.urlRoot = "/responder_items/responses/:id/question_group/:question_group_name";

    QuestionResponse.prototype.initialize = function(questionGroupName, chart) {
      this.questionGroupName = questionGroupName;
      this.responderItem = chart.responderItem();
      return this.url = function() {
        var url;
        url = this.urlRoot.replace(/\:id/, this.responderItem.get('id'));
        return url = url.replace(/\:question_group_name/, this.questionGroupName);
      };
    };

    QuestionResponse.prototype.surveyAccessCode = function() {
      return this.responderItem.get('access_code');
    };

    QuestionResponse.prototype.placement = function(size) {
      var dimensions, margin;
      dimensions = App.Timeline.Dimensions;
      margin = (dimensions.line_height_expanded - size) / 2;
      if (margin > (dimensions.line_height / 2)) {
        return margin;
      } else {
        return dimensions.line_height / 2;
      }
    };

    QuestionResponse.prototype.tableHeight = function(size) {
      var dimensions;
      dimensions = App.Timeline.Dimensions;
      if ((size + dimensions.line_height) > dimensions.line_height) {
        return size + dimensions.line_height;
      }
    };

    return QuestionResponse;

  })(Backbone.Collection);

}).call(this);
