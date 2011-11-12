/* DO NOT MODIFY. This file was compiled Fri, 14 Oct 2011 13:52:55 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/timelineNavView.coffee
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
  App.Views.Timeline.Nav = (function() {
    __extends(Nav, Backbone.View);
    function Nav() {
      this.render = __bind(this.render, this);
      Nav.__super__.constructor.apply(this, arguments);
    }
    Nav.prototype.tagName = "nav";
    Nav.prototype.events = {
      "click li:nth-child(1)": "forward",
      "click li:nth-child(2)": "backward"
    };
    Nav.prototype.forward = function() {
      console.log("forward");
      return this.model.step(-6);
    };
    Nav.prototype.backward = function() {
      console.log("backward");
      return this.model.step(6);
    };
    Nav.prototype.template = function() {
      return JST['timelineNavTmpl'];
    };
    Nav.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };
    return Nav;
  })();
}).call(this);
