/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 15:37:09 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/models/line.coffee
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
  App.Models.Line = (function() {
    __extends(Line, Backbone.Model);
    function Line() {
      this.clearDialogItem = __bind(this.clearDialogItem, this);
      this.hasDialog = __bind(this.hasDialog, this);
      this.previousDialogView = __bind(this.previousDialogView, this);
      this.currentDialogView = __bind(this.currentDialogView, this);
      this.previousDialogItem = __bind(this.previousDialogItem, this);
      this.currentDialogItem = __bind(this.currentDialogItem, this);
      this.setPreviousDialogItem = __bind(this.setPreviousDialogItem, this);
      this.setCurrentDialogItem = __bind(this.setCurrentDialogItem, this);
      Line.__super__.constructor.apply(this, arguments);
    }
    Line.prototype.initialize = function() {
      this.bind("updateDialog", this.setCurrentDialogItem);
      return this.timeline = this.get('timeline');
    };
    Line.prototype.setCurrentDialogItem = function(item) {
      this.setPreviousDialogItem(item);
      return this.set({
        currentDialogItem: item
      });
    };
    Line.prototype.setPreviousDialogItem = function() {
      if (this.currentDialogItem() != null) {
        return this.set({
          previousDialogItem: this.currentDialogItem()
        });
      }
    };
    Line.prototype.currentDialogItem = function() {
      return this.get('currentDialogItem');
    };
    Line.prototype.previousDialogItem = function() {
      return this.get('previousDialogItem');
    };
    Line.prototype.currentDialogView = function() {
      return this.currentDialogItem().get("dialogView");
    };
    Line.prototype.previousDialogView = function() {
      return this.previousDialogItem().get("dialogView");
    };
    Line.prototype.hasDialog = function() {
      return this.get('currentDialogItem') != null;
    };
    Line.prototype.clearDialogItem = function() {
      return this.set({
        previousDialogItem: null
      });
    };
    return Line;
  })();
  App.Collections.LineCollection = (function() {
    __extends(LineCollection, Backbone.Collection);
    function LineCollection() {
      LineCollection.__super__.constructor.apply(this, arguments);
    }
    LineCollection.prototype.model = App.Models.Line;
    return LineCollection;
  })();
}).call(this);
