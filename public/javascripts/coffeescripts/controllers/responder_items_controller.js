/* DO NOT MODIFY. This file was compiled Wed, 28 Sep 2011 15:35:24 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/controllers/responder_items_controller.coffee
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
  App.Controllers.ResponderItemsController = (function() {
    __extends(ResponderItemsController, Backbone.Router);
    function ResponderItemsController() {
      this.closeOpenDialog = __bind(this.closeOpenDialog, this);
      ResponderItemsController.__super__.constructor.apply(this, arguments);
    }
    ResponderItemsController.prototype.initialize = function(options) {
      this.last_item;
      this.responder_items = new App.Collections.ResponderItemsCollection(options.responder_items);
      return this.timeline = this.responder_items.initTimeline(options.timeline);
    };
    ResponderItemsController.prototype.routes = {
      "": "index",
      "responder_items/:id/": "show",
      "!": "closeOpenDialog"
    };
    ResponderItemsController.prototype.show = function(id) {
      var responder_item;
      responder_item = this.responder_items.get({
        id: id
      });
      responder_item.fetch({
        success: __bind(function(model, response) {
          var params;
          params = {
            model: model
          };
          return this.timeline.showItemInDialog(this.last_item, responder_item, params);
        }, this),
        error: function() {
          return console.log("error");
        }
      });
      return this.last_item = responder_item;
    };
    ResponderItemsController.prototype.index = function() {
      console.log("in index");
      return new App.Views.ResponderItems.Index({
        responder_items: this.responder_items
      });
    };
    ResponderItemsController.prototype.closeOpenDialog = function() {
      console.info("in openClose");
      $("#chart-dialog").remove();
      return $("#tml-history").find(".line.open").switchClass('open', 'closed', 1000);
    };
    return ResponderItemsController;
  })();
}).call(this);
