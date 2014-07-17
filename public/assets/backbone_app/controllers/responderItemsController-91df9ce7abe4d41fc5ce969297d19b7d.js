(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Controllers.ResponderItemsController = (function(_super) {
    __extends(ResponderItemsController, _super);

    function ResponderItemsController() {
      return ResponderItemsController.__super__.constructor.apply(this, arguments);
    }

    ResponderItemsController.prototype.initialize = function(options) {
      App.Timeline || (App.Timeline = {});
      App.Timeline.Dimensions = _.omit(options.timeline, ['subject', 'surveys']);
      this.responder_items = new App.Collections.ResponderItemsCollection(options.responder_items);
      return this.timeline = new App.Models.Timeline(options.timeline);
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
      return $("#canvas-p").append(canvas.render().el);
    };

    return ResponderItemsController;

  })(Backbone.Router);

}).call(this);
