/* DO NOT MODIFY. This file was compiled Wed, 06 Jul 2011 08:58:49 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/views/index.coffee
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
  App.Views.ResponderItems.Index = (function() {
    __extends(Index, Backbone.View);
    function Index() {
      Index.__super__.constructor.apply(this, arguments);
    }
    Index.prototype.template = function() {
      return JST["index"];
    };
    Index.prototype.initialize = function() {
      return _.bindAll(this, 'render');
    };
    Index.prototype.render = function() {
      console.log("index VIEW");
      console.log(this.options.responder_items.toJSON());
      $(this.el).html(this.template()({
        responder_items: this.options.responder_items.toJSON()
      }));
      return this;
    };
    return Index;
  })();
}).call(this);
