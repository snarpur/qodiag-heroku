/* DO NOT MODIFY. This file was compiled Tue, 05 Jul 2011 10:01:33 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/show.coffee
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
  (_base = App.Views).ResponderItems || (_base.ResponderItems = {});
  App.Views.ResponderItems.View = (function() {
    __extends(View, Backbone.View);
    function View() {
      View.__super__.constructor.apply(this, arguments);
    }
    View.prototype.events = {
      ".line .item a": 'show'
    };
    View.prototype.template = function() {
      return JST["show"];
    };
    View.prototype.show = function() {
      return alert("hey");
    };
    View.prototype.render = function() {
      $(this.el).html(this.template()(this.options.model.toJSON()));
      return this;
    };
    return View;
  })();
}).call(this);
