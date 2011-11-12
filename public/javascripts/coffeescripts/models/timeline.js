/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 22:47:51 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/models/timeline.coffee
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  App.Models.Timeline = (function() {
    __extends(Timeline, Backbone.Model);
    function Timeline() {
      this.setCanvasEndPosition = __bind(this.setCanvasEndPosition, this);
      this.step = __bind(this.step, this);
      this.hasOpenLine = __bind(this.hasOpenLine, this);
      this.getOpenLine = __bind(this.getOpenLine, this);
      this.setOpenLine = __bind(this.setOpenLine, this);
      this.endsYear = __bind(this.endsYear, this);
      this.startsYear = __bind(this.startsYear, this);
      Timeline.__super__.constructor.apply(this, arguments);
    }
    Timeline.prototype.initialize = function() {
      var years, _i, _ref, _ref2, _results;
      console.log(this);
      years = {
        years: (function() {
          _results = [];
          for (var _i = _ref = this.startsYear(), _ref2 = this.endsYear(); _ref <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref <= _ref2 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this, arguments)
      };
      return this.set(years);
    };
    Timeline.prototype.startsYear = function() {
      return Date.parse(this.get('starts')).getFullYear();
    };
    Timeline.prototype.endsYear = function() {
      return Date.parse(this.get('ends')).getFullYear();
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
    Timeline.prototype.setCanvasEndPosition = function(position) {
      return this.set({
        canvas_end_position: this.get("canvas_width") - position
      });
    };
    Timeline.prototype.changePosition = function(position) {
      var end, gutter;
      gutter = this.get("gutter_width");
      end = this.get("end_position");
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
    return Timeline;
  })();
}).call(this);
