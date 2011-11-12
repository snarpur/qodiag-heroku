/* DO NOT MODIFY. This file was compiled Sat, 15 Oct 2011 15:49:31 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/headingsView.coffee
 */

(function() {
  var _base;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (_base = App.Views).Timeline || (_base.Timeline = {});
  App.Views.Timeline.Headings = (function() {
    __extends(Headings, Backbone.View);
    function Headings() {
      Headings.__super__.constructor.apply(this, arguments);
    }
    Headings.prototype.tagName = "li";
    Headings.prototype.initialize = function() {
      return this.model.headingView = this;
    };
    Headings.prototype.template = function() {
      return JST['headingsTmpl'];
    };
    Headings.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };
    return Headings;
  })();
}).call(this);
