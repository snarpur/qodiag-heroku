/* DO NOT MODIFY. This file was compiled Tue, 19 Jul 2011 15:18:29 GMT from
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
    __extends(ResponderItemsController, Backbone.Router);
    function ResponderItemsController() {
      ResponderItemsController.__super__.constructor.apply(this, arguments);
    }
    ResponderItemsController.prototype.initialize = function(options) {
      this.current;
      this.responder_items = new App.Collections.ResponderItemsCollection(options.responder_items);
      return this.responder_items.initTimeline(options.timeline);
    };
    ResponderItemsController.prototype.routes = {
      "": "index",
      "responder_items/:id/": "show"
    };
    ResponderItemsController.prototype.show = function(id) {
      var responder_item;
      responder_item = this.responder_items.get({
        id: id
      });
      return responder_item.fetch({
        success: function(model, response) {
          var params, show;
          params = {
            model: model
          };
          show = new App.Views.ResponderItems.Show(params);
          return show.render();
        },
        error: function() {
          return console.log("error");
        }
      });
    };
    ResponderItemsController.prototype.index = function() {
      return new App.Views.ResponderItems.Index({
        responder_items: this.responder_items
      });
    };
    return ResponderItemsController;
  })();
}).call(this);
