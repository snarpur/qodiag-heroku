/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 23:05:00 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/itemDialogView.coffee
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
  App.Views.Timeline.ItemDialog = (function() {
    __extends(ItemDialog, Backbone.View);
    function ItemDialog() {
      this.renderCharts = __bind(this.renderCharts, this);
      this.closeDialog = __bind(this.closeDialog, this);
      ItemDialog.__super__.constructor.apply(this, arguments);
    }
    ItemDialog.prototype.className = "chart-dialog";
    ItemDialog.prototype.events = {
      "click a.close": "closeDialog"
    };
    ItemDialog.prototype.initialize = function() {
      this.line = this.options.line;
      this.timeline = this.options.timeline;
      return this.model.set({
        dialogView: this
      });
    };
    ItemDialog.prototype.template = function() {
      return JST['itemDialogTmpl'];
    };
    ItemDialog.prototype.closeDialog = function() {
      return this.line.trigger("updateDialog", null);
    };
    ItemDialog.prototype.renderCharts = function() {
      return this.model.fetch({
        success: __bind(function(model, response) {
          var charts;
          charts = new App.Views.Charts({
            model: model,
            timeline: this.options.timeline
          });
          $(this.el).css({
            "left": "" + (-1 * this.timeline.get('current_position')) + "px"
          });
          console.log($(this.line.view.el).position().top);
          $(this.el).css({
            "top": "" + ($(this.line.view.el).position().top) + "px"
          });
          $(this.el).append(charts.render().el);
          return charts.renderCharts();
        }, this),
        error: function() {
          return console.log("error");
        }
      });
    };
    ItemDialog.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };
    return ItemDialog;
  })();
}).call(this);
