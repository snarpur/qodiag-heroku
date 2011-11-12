/* DO NOT MODIFY. This file was compiled Thu, 13 Oct 2011 13:45:29 GMT from
 * /Users/orripalsson/Dev/snarpur/app/02/snarpur/app/coffeescripts/controllers/responderItemsController.coffee
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
      this.responder_items = new App.Collections.ResponderItemsCollection(options.responder_items);
      this.timeline = new App.Models.Timeline(options.timeline);
      return this.responder_items.setTimeline(this.timeline);
    };
    ResponderItemsController.prototype.routes = {
      "": "index"
    };
    ResponderItemsController.prototype.index = function() {
      var canvas, canvasEl, params;
      canvasEl = $("#canvas");
      params = {
        collection: this.responder_items,
        model: this.timeline,
        el: canvasEl
      };
      canvas = new App.Views.Timeline.Canvas(params);
      return $("#content").append(canvas.render().el);
    };
    ResponderItemsController.prototype.closeOpenDialog = function() {
      console.info("in openClose");
      $("#chart-dialog").remove();
      return $("#tml-history").find(".line.open").switchClass('open', 'closed', 1000);
    };
    return ResponderItemsController;
  })();
}).call(this);
