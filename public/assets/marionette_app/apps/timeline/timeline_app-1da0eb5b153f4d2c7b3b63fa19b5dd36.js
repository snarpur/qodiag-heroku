(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("TimelineApp", function(TimelineApp, App, Backbone, Marionette, $, _) {
    var API;
    TimelineApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "timeline/people/:id": "list"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      list: function(id, options) {
        var ctrl;
        if (options == null) {
          options = {};
        }
        return ctrl = new TimelineApp.List.Controller(id, options);
      }
    };
    App.commands.setHandler("show:timeline", function(options) {
      return API.list(options);
    });
    return App.addInitializer(function() {
      return new TimelineApp.Router({
        controller: API
      });
    });
  });

}).call(this);
