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
