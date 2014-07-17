(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Timeline = (function(_super) {
    __extends(Timeline, _super);

    function Timeline() {
      this.getChartHeight = __bind(this.getChartHeight, this);
      this.getSurveyAccessCode = __bind(this.getSurveyAccessCode, this);
      this.positionOnLine = __bind(this.positionOnLine, this);
      this.dayPixelsFromMonthStart = __bind(this.dayPixelsFromMonthStart, this);
      this.monthPixelsFromStart = __bind(this.monthPixelsFromStart, this);
      this.monthsFromStart = __bind(this.monthsFromStart, this);
      this.centeredDatePosition = __bind(this.centeredDatePosition, this);
      this.goToDate = __bind(this.goToDate, this);
      this.changePosition = __bind(this.changePosition, this);
      this.endPosition = __bind(this.endPosition, this);
      this.step = __bind(this.step, this);
      this.hasOpenLine = __bind(this.hasOpenLine, this);
      this.getOpenLine = __bind(this.getOpenLine, this);
      this.setOpenLine = __bind(this.setOpenLine, this);
      this.getSubjectId = __bind(this.getSubjectId, this);
      this.fillSurveyMenu = __bind(this.fillSurveyMenu, this);
      return Timeline.__super__.constructor.apply(this, arguments);
    }

    Timeline.prototype.initialize = function() {
      var years, _i, _ref, _ref1, _results;
      years = {
        years: (function() {
          _results = [];
          for (var _i = _ref = this.get("starts"), _ref1 = this.get("ends"); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this)
      };
      this.set(years);
      this.set({
        subject: new App.Models.Subject(this.get('subject'))
      });
      this.set({
        lines: new App.Collections.LineCollection([], this)
      });
      this.get('lines').setSubjectId(this.getSubjectId());
      return this.set({
        surveyMenu: new App.Collections.SurveyMenuItemCollection([])
      });
    };

    Timeline.prototype.fillSurveyMenu = function() {
      return this.get('surveyMenu').add(this.get('surveys'));
    };

    Timeline.prototype.getSubjectId = function() {
      return this.get('subject').id;
    };

    Timeline.prototype.setOpenLine = function(line) {
      return this.set({
        openLine: line
      });
    };

    Timeline.prototype.getOpenLine = function() {
      return this.get('openLine');
    };

    Timeline.prototype.hasOpenLine = function() {
      return this.getOpenLine() != null;
    };

    Timeline.prototype.step = function(steps) {
      var movement, position;
      movement = this.get("month_width") * steps;
      position = this.get("current_position") + movement;
      return this.changePosition(position);
    };

    Timeline.prototype.endPosition = function() {
      return this.get("canvas_width") - this.get('history_width');
    };

    Timeline.prototype.changePosition = function(position) {
      var end, gutter;
      gutter = this.get("gutter_width");
      end = this.endPosition();
      if (position > gutter) {
        position = gutter;
      }
      if (position < end) {
        position = end;
      }
      return this.set({
        current_position: position
      });
    };

    Timeline.prototype.goToDate = function() {
      var position;
      position = this.monthPixelsFromStart(this.centeredDatePosition());
      return this.changePosition(-position);
    };

    Timeline.prototype.centeredDatePosition = function() {
      return this.get('current_date').moveToFirstDayOfMonth().add(-7).month();
    };

    Timeline.prototype.monthsFromStart = function(date) {
      var starts;
      starts = new XDate("" + (this.get("starts")));
      return Math.floor(starts.diffMonths(date));
    };

    Timeline.prototype.monthPixelsFromStart = function(date) {
      return this.monthsFromStart(date) * this.get('month_width');
    };

    Timeline.prototype.dayPixelsFromMonthStart = function(date) {
      var daysInMonth;
      daysInMonth = XDate.getDaysInMonth(date.getFullYear(), date.getMonth());
      return (this.get('month_width') / daysInMonth) * (date.getDate() - 1);
    };

    Timeline.prototype.positionOnLine = function(date) {
      date = new XDate(date.toString());
      return this.monthPixelsFromStart(date) + this.dayPixelsFromMonthStart(date);
    };

    Timeline.prototype.getSurveyAccessCode = function(id) {
      var _ref;
      return (_ref = _.find(this.get('surveys'), function(o) {
        return o.id === +id;
      })) != null ? _ref.access_code : void 0;
    };

    Timeline.prototype.getChartHeight = function() {
      return this.get('line_height_expanded') - this.get('line_height');
    };

    return Timeline;

  })(Backbone.Model);

}).call(this);
