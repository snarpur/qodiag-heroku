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
