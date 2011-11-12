/* DO NOT MODIFY. This file was compiled Wed, 05 Oct 2011 11:09:46 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/lineItemView.coffee
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
  App.Views.Timeline.LineItem = (function() {
    __extends(LineItem, Backbone.View);
    function LineItem() {
      this.setPosition = __bind(this.setPosition, this);
      this.show = __bind(this.show, this);
      LineItem.__super__.constructor.apply(this, arguments);
    }
    LineItem.prototype.tagName = "span";
    LineItem.prototype.className = "item";
    LineItem.prototype.events = {
      "click a": "show"
    };
    LineItem.prototype.initialize = function() {
      this.line = this.options.line;
      return this.setPosition();
    };
    LineItem.prototype.template = function() {
      return JST['lineItemTmpl'];
    };
    LineItem.prototype.show = function() {
      return this.line.trigger("updateDialog", this.model);
    };
    LineItem.prototype.setPosition = function() {
      return $(this.el).css('left', "" + (this.model.get('position')) + "px");
    };
    LineItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };
    return LineItem;
  })();
}).call(this);
