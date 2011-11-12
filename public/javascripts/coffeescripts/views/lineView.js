/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 22:49:19 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/lineView.coffee
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
  App.Views.Timeline.Line = (function() {
    __extends(Line, Backbone.View);
    function Line() {
      this.renderLineItems = __bind(this.renderLineItems, this);
      this.renderDialog = __bind(this.renderDialog, this);
      this.removeDialog = __bind(this.removeDialog, this);
      this.changeLineState = __bind(this.changeLineState, this);
      Line.__super__.constructor.apply(this, arguments);
    }
    Line.prototype.className = "line closed";
    Line.prototype.defaults = {
      dialog: ".chart-dialog"
    };
    Line.prototype.initialize = function() {
      this.collection = this.model.collection;
      this.timeline = this.options.timeline;
      this.items = this.model.get('items');
      this.model.view = this;
      this.model.bind("change:previousDialogItem", this.removeDialog);
      return this.model.bind("change:currentDialogItem", this.changeLineState);
    };
    Line.prototype.template = function() {
      return JST['lineTmpl'];
    };
    Line.prototype.changeLineState = function(item) {
      var currentDialog;
      currentDialog = this.model.currentDialogItem();
      if (currentDialog === null) {
        $(this.el).addClass('closed').removeClass('open');
        return this.model.clearDialogItem();
      } else {
        $(this.el).addClass('open').removeClass('closed');
        return this.renderDialog(this.model.currentDialogItem());
      }
    };
    Line.prototype.removeDialog = function(item) {
      if (this.model.previousDialogItem() != null) {
        return this.model.previousDialogView().remove();
      }
    };
    Line.prototype.renderDialog = function(item) {
      var dialog;
      dialog = new App.Views.Timeline.ItemDialog({
        line: this.model,
        model: item,
        timeline: this.timeline
      });
      console.log($(this.el).position());
      $(this.el).append(dialog.render().el);
      return dialog.renderCharts();
    };
    Line.prototype.renderLineItems = function(item) {
      var lineItem;
      lineItem = new App.Views.Timeline.LineItem({
        model: item,
        line: this.model
      });
      return this.$(".line-items").append(lineItem.render().el);
    };
    Line.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      _.each(this.items, this.renderLineItems);
      return this;
    };
    return Line;
  })();
}).call(this);
