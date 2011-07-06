/* DO NOT MODIFY. This file was compiled Tue, 05 Jul 2011 14:59:17 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/models/responder_item.coffee
 */

(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
      ResponderItem.__super__.constructor.apply(this, arguments);
    }
    ResponderItem.prototype.urlRoot = "/ResponderItems";
    ResponderItem.prototype.paramRoot = "responder_item";
    return ResponderItem;
  })();
  App.Collections.ResponderItemsCollection = (function() {
    __extends(ResponderItemsCollection, Backbone.Collection);
    function ResponderItemsCollection() {
      ResponderItemsCollection.__super__.constructor.apply(this, arguments);
    }
    ResponderItemsCollection.prototype.model = App.Models.ResponderItem;
    ResponderItemsCollection.prototype.url = '/responder_items';
    return ResponderItemsCollection;
  })();
}).call(this);