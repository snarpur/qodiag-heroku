/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 22:47:51 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/timelineView.coffee
 */

(function() {
  var _base;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (_base = App.Views).Timeline || (_base.Timeline = {});
  App.Views.Timeline.Canvas = (function() {
    __extends(Canvas, Backbone.View);
    function Canvas() {
      this.render = __bind(this.render, this);
      this.addHeader = __bind(this.addHeader, this);
      this.sortCollection = __bind(this.sortCollection, this);
      this.move = __bind(this.move, this);
      this.renderNavigation = __bind(this.renderNavigation, this);
      this.renderLines = __bind(this.renderLines, this);
      this.renderContent = __bind(this.renderContent, this);
      this.updateOpenLine = __bind(this.updateOpenLine, this);
      Canvas.__super__.constructor.apply(this, arguments);
    }
    Canvas.prototype.id = "canvas";
    Canvas.prototype.initialize = function() {
      this.model.view = this;
      this.lines = new App.Collections.LineCollection();
      this.lines.bind("change:currentDialogItem", this.updateOpenLine);
      this.model.bind("change:current_position", this.move);
      return this.lines.bind("add", this.addHeader);
    };
    Canvas.prototype.template = function() {
      return JST['timelineTmpl'];
    };
    Canvas.prototype.updateOpenLine = function(line) {
      var _ref;
      if (!(line === null || !(this.model.getOpenLine() != null))) {
        if (line.cid !== ((_ref = this.model.getOpenLine()) != null ? _ref.cid : void 0)) {
          this.model.getOpenLine().trigger("updateDialog", null);
        }
      }
      return this.model.setOpenLine(line);
    };
    Canvas.prototype.renderContent = function(items, name) {
      var params;
      params = {
        items: items,
        name: name,
        timeline: this.model
      };
      return this.renderLines(params);
    };
    Canvas.prototype.renderLines = function(params) {
      var line, lineView;
      line = new App.Models.Line(params);
      this.lines.add(line);
      params = {
        model: line,
        timeline: this.model
      };
      lineView = new App.Views.Timeline.Line(params);
      return this.$("#tml-history").append(lineView.render().el);
    };
    Canvas.prototype.renderNavigation = function() {
      var timelineNav;
      timelineNav = new App.Views.Timeline.Nav({
        model: this.model
      });
      return $(this.el).prepend(timelineNav.render().el);
    };
    Canvas.prototype.move = function() {
      return this.$("#tml-history").css({
        "margin-left": this.model.get("current_position")
      });
    };
    Canvas.prototype.sortCollection = function() {
      return this.collection.groupBy(function(item) {
        return item.get("access_code");
      });
    };
    Canvas.prototype.addHeader = function(item) {
      var heading;
      heading = new App.Views.Timeline.Headings({
        model: item
      });
      return this.$('#tml-body > ul').append(heading.render().el);
    };
    Canvas.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderNavigation();
      _.each(this.sortCollection(), this.renderContent);
      console.log(this.lines, "LINES");
      return this;
    };
    return Canvas;
  })();
}).call(this);
