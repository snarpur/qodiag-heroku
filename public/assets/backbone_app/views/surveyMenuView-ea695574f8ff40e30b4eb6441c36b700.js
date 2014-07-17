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
