/* DO NOT MODIFY. This file was compiled Fri, 14 Oct 2011 12:55:17 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/models/responderItem.coffee
 */

(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  App.Models.ResponderItem = (function() {
    __extends(ResponderItem, Backbone.Model);
    function ResponderItem() {
      ResponderItem.__super__.constructor.apply(this, arguments);
    }
    ResponderItem.prototype.urlRoot = "/responder_items";
    ResponderItem.prototype.paramRoot = '/responder_items';
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
    ResponderItemsCollection.prototype.setTimeline = function(timeline) {
      return this.timeline = timeline;
    };
    ResponderItemsCollection.prototype.getTimeline = function() {
      return this.timeline;
    };
    return ResponderItemsCollection;
  })();
}).call(this);