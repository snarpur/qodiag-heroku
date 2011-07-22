/* DO NOT MODIFY. This file was compiled Tue, 19 Jul 2011 11:34:38 GMT from
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
    Index.prototype.el = "#canvas";
    Index.prototype.template = function() {
      return JST["index"];
    };
    Index.prototype.initialize = function() {
      this.el = $(this.el);
      _.bindAll(this, 'addOne', 'addAll', 'render');
      return this.render();
    };
    Index.prototype.addOne = function(item) {
      return $("#line-" + (item.get('access_code')), this.el).append(this.template()(item.toJSON()));
    };
    Index.prototype.addAll = function() {
      return this.options.responder_items.each(this.addOne);
    };
    Index.prototype.render = function() {
      this.addAll();
      return this;
    };
    return Index;
  })();
}).call(this);
