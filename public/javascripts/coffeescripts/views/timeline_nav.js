/* DO NOT MODIFY. This file was compiled Fri, 15 Jul 2011 09:27:58 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/timeline_nav.coffee
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
    Nav.prototype.tagName = "ul";
    Nav.prototype.className = "tml-history-nav";
    Nav.prototype.events = {
      "click ul li:nth-child(1)": "backwards",
      "click ul li:nth-child(2)": "forwards"
    };
    Nav.prototype.initialize = function() {
      return this.render();
    };
    Nav.prototype.forwards = function() {
      return this.model.step(-2);
    };
    Nav.prototype.backwards = function() {
      return this.model.step(2);
    };
    Nav.prototype.template = function() {
      return JST['timeline_nav'];
    };
    Nav.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      $("#canvas").prepend(this.el);
      return this;
    };
    return Nav;
  })();
}).call(this);
