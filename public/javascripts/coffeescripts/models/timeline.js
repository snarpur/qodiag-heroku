/* DO NOT MODIFY. This file was compiled Fri, 15 Jul 2011 12:14:28 GMT from
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
      this.step = __bind(this.step, this);
      Timeline.__super__.constructor.apply(this, arguments);
    }
    Timeline.prototype.initialize = function(model) {
      this.model = model;
      this.history = $("#tml-history");
      return this.bind("change:current_position", this.move);
    };
    Timeline.prototype.step = function(steps) {
      var movement, position;
      movement = this.get("month_width") * steps;
      position = this.get("current_position") + movement;
      ({
        setCanvasEndPosition: position
      });
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
    Timeline.prototype.move = function() {
      return this.history.animate({
        left: this.get("current_position")
      }, 500);
    };
    return Timeline;
  })();
}).call(this);
