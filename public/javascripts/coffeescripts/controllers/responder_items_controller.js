/* DO NOT MODIFY. This file was compiled Tue, 05 Jul 2011 17:23:43 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/controllers/responder_items_controller.coffee
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
  App.Controllers.ResponderItemsController = (function() {
    __extends(ResponderItemsController, Backbone.Controller);
    function ResponderItemsController() {
      ResponderItemsController.__super__.constructor.apply(this, arguments);
    }
    ResponderItemsController.prototype.initialize = function(options) {
      console.log("in RI controller " + options.responder_items[0].name);
      this.responder_items = new App.Collections.ResponderItemsCollection(options);
      return console.log(this.responder_items, "initialize controller");
    };
    ResponderItemsController.prototype.routes = {
      ".*": "index",
      "/:id": "show"
    };
    ResponderItemsController.prototype.show = function(id) {
      var responder_item;
      responder_item = this.responder_items.get(id);
      this.view = new App.Views.ResponderItems.View({
        model: responder_item
      });
      return $("#responder_item").html(this.view.render().el);
    };
    ResponderItemsController.prototype.index = function(items) {
      console.log("index CONTROLLER being called");
      this.view = new App.Views.ResponderItems.Index({
        responder_items: this.responder_items
      });
      console.log(this.view, "@view");
      return $("#test-index").html(this.view.render().el);
    };
    return ResponderItemsController;
  })();
}).call(this);
