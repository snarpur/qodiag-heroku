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
