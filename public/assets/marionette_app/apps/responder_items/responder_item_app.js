(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ResponderItemsApp", function(ResponderItemsApp, App, Backbone, Marionette, $, _) {
    var API;
    ResponderItemsApp.rootRoute = "settings" + (Routes.entry_sets_path());
    ResponderItemsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "items": "listRequests"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      listRequests: function() {
        return ResponderItemsApp.List.Controller.items();
      },
      create: function(options) {
        var ctrl;
        ctrl = new ResponderItemsApp.Create.Controller(options);
        return ctrl.create();
      },
      createSurvey: function(options) {
        var ctrl;
        ctrl = new ResponderItemsApp.Create.Controller(options);
        return ctrl.createSurvey();
      }
    };
    App.reqres.setHandler("create:responder:item:view", function(options) {
      return API.create(options);
    });
    App.reqres.setHandler("create:survey:view", function(options) {
      return API.createSurvey(options);
    });
    return App.addInitializer(function() {
      return new ResponderItemsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
