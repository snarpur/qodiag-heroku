(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.SurveyMenuItem = (function(_super) {
    __extends(SurveyMenuItem, _super);

    function SurveyMenuItem() {
      this.addLine = __bind(this.addLine, this);
      this.hideLine = __bind(this.hideLine, this);
      this.showLine = __bind(this.showLine, this);
      this.subjectId = __bind(this.subjectId, this);
      return SurveyMenuItem.__super__.constructor.apply(this, arguments);
    }

    SurveyMenuItem.prototype.subjectId = function() {
      return this.get('timeline').getSubjectId();
    };

    SurveyMenuItem.prototype.showLine = function(line) {
      this.set({
        visibility: 'visible',
        line: line
      });
      return line.set({
        menuItem: this
      });
    };

    SurveyMenuItem.prototype.hideLine = function() {
      this.set({
        visibility: "hidden"
      });
      this.get('line').set({
        menuItem: null
      });
      return this.unset('line');
    };

    SurveyMenuItem.prototype.addLine = function() {
      return this.get('lines').addLine({
        survey_id: this.get("id"),
        name: this.get("access_code"),
        timeline: this.get('timeline')
      });
    };

    return SurveyMenuItem;

  })(Backbone.Model);

  App.Collections.SurveyMenuItemCollection = (function(_super) {
    __extends(SurveyMenuItemCollection, _super);

    function SurveyMenuItemCollection() {
      return SurveyMenuItemCollection.__super__.constructor.apply(this, arguments);
    }

    SurveyMenuItemCollection.prototype.model = App.Models.SurveyMenuItem;

    return SurveyMenuItemCollection;

  })(Backbone.Collection);

}).call(this);