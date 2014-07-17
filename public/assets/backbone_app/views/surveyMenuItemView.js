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
