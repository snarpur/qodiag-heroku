/* DO NOT MODIFY. This file was compiled Tue, 19 Jul 2011 14:18:48 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/models/responder_item.coffee
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
  App.Models.ResponderItem = (function() {
    __extends(ResponderItem, Backbone.Model);
    function ResponderItem() {
      this.getTimeline = __bind(this.getTimeline, this);
      ResponderItem.__super__.constructor.apply(this, arguments);
    }
    ResponderItem.prototype.urlRoot = "/responder_items";
    ResponderItem.prototype.paramRoot = '/responder_items';
    ResponderItem.prototype.getTimeline = function(opt) {
      return this.collection.getTimeline(opt);
    };
    return ResponderItem;
  })();
  App.Collections.ResponderItemsCollection = (function() {
    __extends(ResponderItemsCollection, Backbone.Collection);
    function ResponderItemsCollection() {
      this.getTimeline = __bind(this.getTimeline, this);
      ResponderItemsCollection.__super__.constructor.apply(this, arguments);
    }
    ResponderItemsCollection.prototype.model = App.Models.ResponderItem;
    ResponderItemsCollection.prototype.url = "/responder_items";
    ResponderItemsCollection.prototype.screen = {};
    ResponderItemsCollection.prototype.initTimeline = function(timeline) {
      this.timeline = new App.Models.Timeline(timeline);
      return new App.Views.Timeline.Nav({
        model: this.timeline
      });
    };
    ResponderItemsCollection.prototype.getTimeline = function(opt) {
      return this.timeline.get(opt);
    };
    return ResponderItemsCollection;
  })();
}).call(this);
