(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Timeline.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.render = __bind(this.render, this);
      this.removeLine = __bind(this.removeLine, this);
      this.removeItems = __bind(this.removeItems, this);
      this.renderAddItemOverlay = __bind(this.renderAddItemOverlay, this);
      this.newItemOverlayState = __bind(this.newItemOverlayState, this);
      this.renderLineItem = __bind(this.renderLineItem, this);
      this.renderLineItems = __bind(this.renderLineItems, this);
      this.renderDialog = __bind(this.renderDialog, this);
      this.removeDialog = __bind(this.removeDialog, this);
      this.resizeLine = __bind(this.resizeLine, this);
      this.changeLineState = __bind(this.changeLineState, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.className = "line state-closed";

    Line.prototype.defaults = {
      dialog: ".chart-dialog"
    };

    Line.prototype.initialize = function() {
      this.timeline = this.options.timeline;
      this.model.view = this;
      this.model.on("change:previousDialogItem", this.removeDialog);
      this.model.on("change:currentDialogItem", this.changeLineState);
      this.model.on("change:newItemOverlayState", this.newItemOverlayState);
      this.model.on("change:menuItem", this.removeItems);
      this.model.on("remove", this.removeLine);
      this.model.on('change:currentChartHeight', this.resizeLine);
      return this.model.get('items').on("add", this.renderLineItems);
    };

    Line.prototype.template = function() {
      return JST['backbone_app/templates/lineTmpl'];
    };

    Line.prototype.changeLineState = function(line, item) {
      var overlayState, state;
      if (item) {
        overlayState = "charts";
      }
      state = item ? 'open' : 'closed';
      $(this.el).setCssState(state);
      $(this.el).setCssState(overlayState, 'overlay');
      if (item) {
        return this.renderDialog(this.model.currentDialogItem());
      } else {
        return this.model.clearDialogItem();
      }
    };

    Line.prototype.resizeLine = function(line) {
      var height;
      height = line.get('currentChartHeight');
      height = height === '' ? '' : height + App.Timeline.Dimensions.line_height;
      return this.$el.css("height", height);
    };

    Line.prototype.removeDialog = function(item) {
      if (this.model.previousDialogItem() != null) {
        this.model.previousDialogView().remove();
        return this.model.previousDialogItem().set({
          dialogView: null
        });
      }
    };

    Line.prototype.renderDialog = function(item) {
      var dialog;
      dialog = new App.Views.Timeline.ItemDialog({
        line: this.model,
        model: item,
        timeline: this.timeline
      });
      $(this.el).append(dialog.render().el);
      return dialog.renderColumnCharts();
    };

    Line.prototype.renderLineItems = function() {
      this.$(".line-items").empty();
      return _.each(this.model.get('items').models, this.renderLineItem);
    };

    Line.prototype.renderLineItem = function(item) {
      var lineItem;
      lineItem = new App.Views.Timeline.LineItem({
        model: item,
        line: this.model,
        timeline: this.timeline
      });
      return this.$(".line-items").append(lineItem.render().el);
    };

    Line.prototype.newItemOverlayState = function(self, state) {
      var overlayState;
      if (state === 'open') {
        overlayState = "new-item";
      }
      $(this.el).setCssState(state);
      return $(this.el).setCssState(overlayState, 'overlay');
    };

    Line.prototype.renderAddItemOverlay = function() {
      var overlay;
      overlay = new App.Views.Timeline.NewItem({
        model: this.model,
        timeline: this.timeline
      });
      return $(this.el).append(overlay.render().el);
    };

    Line.prototype.removeItems = function() {
      if (this.model.get('menuItem') === null) {
        return this.model.removeItems();
      }
    };

    Line.prototype.removeLine = function() {
      return $(this.el).remove();
    };

    Line.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderAddItemOverlay();
      this.renderLineItems();
      return this;
    };

    return Line;

  })(Backbone.View);

}).call(this);
